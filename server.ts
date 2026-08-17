import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import 'dotenv/config';
import fs from 'fs';

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

let db: any = null;
try {
  const firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp, (firebaseConfig as any).firestoreDatabaseId);
} catch (error) {
  console.error("Firebase init error:", error);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Media serving endpoint
  app.get("/api/debug-pages-all", async (req, res) => {
    try {
      // using global db
      const snapshot = await getDocs(collection(db, "pages"));
      res.json(snapshot.docs.map(d => d.id));
    } catch(err) {
      res.status(500).send(err.message);
    }
  });

  app.get("/api/debug-pages", async (req, res) => {
    try {
      // use global db
      const docSnap1 = await getDoc(doc(db, "pages", "home"));
      const docSnap2 = await getDoc(doc(db, "pages", "is-basvurusu"));
      res.json({
        bursluluk: docSnap1.exists() ? docSnap1.data() : null,
        isBasvurusu: docSnap2.exists() ? docSnap2.data() : null, doc3: (await getDoc(doc(db, 'pages', 'is-basvuru-formu'))).data()
      });
    } catch(err) {
      res.status(500).send(err.message);
    }
  });

  app.get("/api/media/:id", async (req, res) => {
    try {
      if (!db) {
        return res.status(500).send('Firebase not configured');
      }
      const docRef = doc(db, 'media', req.params.id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.url && data.url.startsWith('data:image/')) {
          const parts = data.url.split(';base64,');
          if (parts.length === 2) {
            const mimeType = parts[0].replace('data:', '');
            const buffer = Buffer.from(parts[1], 'base64');
            res.set('Content-Type', mimeType);
            res.set('Cache-Control', 'public, max-age=31536000, immutable');
            return res.send(buffer);
          }
        } else if (data.url && (data.url.startsWith('http://') || data.url.startsWith('https://'))) {
          return res.redirect(data.url);
        }
      }
      res.status(404).send('Not found');
    } catch(e: any) {
      console.error(e);
      res.status(500).send(e.message);
    }
  });

  // AI Assistant endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, knowledgeBase, siteContext } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error("GEMINI_API_KEY environment variable is not defined");
        return res.status(500).json({ error: "GEMINI_API_KEY eksik. Lütfen ortam değişkenlerini kontrol edin." });
      }

      const ai = new GoogleGenAI({ 
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      const systemInstruction = `SİSTEM VE MİMARİ BAĞLAMI:
Bu uygulama, web sitesinde yer alan mevcut canlı destek penceresi modülünün arka plan mantığının yenilenmiş halidir.
- Arayüz Tasarımı: Sitedeki mevcut asistan penceresi ve görsel modül tasarımı birebir korunmaktadır.
- Yönetim Paneli: Yönetim paneli tarafı, bilgi tabanını (JSON/Veritabanı) ve yanıt kurallarını güncelleyecek şekilde bu yeni yapıya entegre edilmiştir.
- Çalışma Mantığı: Sistem iki aşamalıdır. İlk aşamada yönetim panelinden tanımlanan veriler yerel olarak taranır; yanıt bulunamadığında ikinci aşamada sen devreye girersin.

SENİN ROLÜN VE KURALLARIN:
Sen, mevcut canlı destek penceresi arayüzünde kullanıcı sorularını yanıtlayan arka plan asistanısın.

1. Bilgi Tabanına Sadakat: Yönetim paneli üzerinden sana aktarılan bilgi tabanı (context) dışına çıkma. Bilmediğin veya bilgi tabanında karşılığı olmayan konularda kesinlikle uydurma cevap verme.
2. Modül Arayüzüne Yönlendirme: Bir sorunun yanıtı bilgi tabanında yoksa veya canlı yetkili gerekiyorsa, bunu dürüstçe belirt ve kullanıcıyı mevcut asistan penceresinde yer alan ilgili butonlara (örneğin: "WhatsApp ile İletişim", "İletişim Formu" veya "Yetkiliye Bağlan") yönlendir. (Not: Form açmasını önermek istersen cevabının sonuna [FORM_TEKLIFI] yaz).
3. Arayüz Tasarımına Uyum: Yanıtların mevcut sohbet penceresi tasarımını bozmayacak şekilde kısa, öz, anlaşılır ve yapıcı olsun.

ÖRNEK YANIT YAKLAŞIMLARI:
- Bilgi mevcutsa: "Siparişleriniz 1-3 iş günü içerisinde kargoya teslim edilmektedir."
- Bilgi mevcut değilse: "Bu konu hakkında sistemimde kayıtlı bilgi bulunmamaktadır. Dilerseniz penceredeki 'İletişim Formu' veya 'WhatsApp' butonlarını kullanarak ekibimize ulaşabilirsiniz. [FORM_TEKLIFI]"

SİTE SAYFA VE BİLGİ İÇERİKLERİ:
${siteContext || 'Yok'}

EK KURUMSAL BİLGİ BANKASI VE NOTLAR:
${knowledgeBase || 'Yok'}`;
      
      let formattedMessages = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text || '' }]
      }));

      // Gemini API requires conversation to start with a 'user' turn
      while (formattedMessages.length > 0 && formattedMessages[0].role === 'model') {
        formattedMessages.shift();
      }

      if (formattedMessages.length === 0) {
        return res.status(400).json({ error: "Geçerli bir mesaj bulunamadı." });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: formattedMessages,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2
        }
      });
      res.json({ text: response.text });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  // Notification endpoint
  app.post("/api/notify", async (req, res) => {
    try {
      const { email, text } = req.body;
      const results = { email: false, errors: [] as string[] };
      
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        try {
          let host = process.env.SMTP_HOST;
          if (host.includes('://')) {
            host = host.split('://')[1];
          }
          const transporter = nodemailer.createTransport({
            host: host,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });
          await transporter.sendMail({
            from: `"Dost Koleji Veli Asistanı" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Dost Koleji Veli Asistanı - Yeni Form Başvurusu",
            text: text,
          });
          results.email = true;
        } catch (err: any) {
          console.error("Email send error:", err);
          results.errors.push(`Email error: ${err.message}`);
        }
      } else { 
        results.errors.push("Email configuration (SMTP) is missing.");
      }

      if (!results.email) { 
        return res.status(500).json({ success: false, message: 'Bildirimler gönderilemedi. E-posta (SMTP) ayarları eksik veya hatalı.', errors: results.errors });
      }

      res.json({ success: true, message: 'Notification processed', results });
    } catch (e: any) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
