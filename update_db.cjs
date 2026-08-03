const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where, updateDoc, doc } = require('firebase/firestore');
require('dotenv').config();

const firebaseConfig = require('./firebase-applet-config.json');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  console.log("Querying pages...");
  const q = query(collection(db, "pages"), where("title", "==", "Kulüp Kayıt Formu"));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log("No page found with title Kulüp Kayıt Formu");
  } else {
    for (const d of snapshot.docs) {
      console.log("Updating page", d.id);
      await updateDoc(d.ref, {
        blocks: [
          {
            type: "club_registration_form",
            titlePart1: "Dost Koleji",
            titlePart2: "Kulüp Kayıt",
            subtitle: "Öğrenci Kulüp Kayıt Portalı",
            clubs: [
              { id: "spor", label: "Spor", icon: "sports_basketball" },
              { id: "sanat", label: "Sanat", icon: "palette" },
              { id: "bilim", label: "Bilim", icon: "biotech" },
              { id: "muzik", label: "Müzik", icon: "music_note" },
              { id: "robotik", label: "Robotik", icon: "smart_toy" },
              { id: "drama", label: "Drama", icon: "theater_comedy" }
            ],
            inputs: [
              { type: 'section_title', label: 'Öğrenci Bilgileri', icon: 'person' },
              { type: 'text', name: 'studentName', label: 'Adı Soyadı', placeholder: 'Örn: Ahmet Yılmaz', required: true },
              { type: 'select', name: 'studentCampus', label: 'Kampüs Seçimi', options: 'Eryaman Kampüsü, Oran Kampüsü, Ümitköy Kampüsü', required: true },
              { type: 'select', name: 'studentClass', label: 'Sınıfı', options: '1. Sınıf, 2. Sınıf, 3. Sınıf, 4. Sınıf, 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf', required: true },
              { type: 'section_title', label: 'Veli İletişim Bilgileri', icon: 'contact_phone' },
              { type: 'text', name: 'parentName', label: 'Veli Adı Soyadı', placeholder: 'Örn: Mehmet Yılmaz', required: true },
              { type: 'tel', name: 'parentPhone', label: 'Telefon Numarası', placeholder: '0(5xx) xxx xx xx', required: true },
              { type: 'checkbox', name: 'kvkkConsent', label: 'KVKK Aydınlatma Metni\'ni okudum, kişisel verilerimin kulüp kaydı amacıyla işlenmesini onaylıyorum.', required: true }
            ]
          }
        ]
      });
      console.log("Updated!");
    }
  }
  process.exit(0);
}

run().catch(console.error);
