import { useState, useEffect, useRef, FormEvent } from 'react';
import { X, Send, Menu, CheckCircle2 } from 'lucide-react';
import { doc, getDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Markdown from 'react-markdown';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  isForm?: boolean;
}

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Merhaba! Ben Dost Koleji Veli Asistanı. Okulumuz, kampüslerimiz, kayıt süreci ve eğitim programlarımız hakkında size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [siteContext, setSiteContext] = useState('');
  
  const [activeForm, setActiveForm] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clear any previously saved chat history so refresh always starts clean
    sessionStorage.removeItem('dost_assistant_chat');
    localStorage.removeItem('dost_assistant_chat');

    // Load settings from Firebase
    const loadSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'assistant');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setSettings(snap.data());
        }
      } catch (e) {
        console.error("Error loading assistant settings:", e);
      }
    };

    // Load dynamic site pages content to pass as AI context
    const loadSiteContext = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'pages'));
        const summaries: string[] = [];
        snapshot.docs.forEach(docSnap => {
          const d = docSnap.data();
          if (d.title) {
            let details = '';
            if (Array.isArray(d.blocks)) {
              d.blocks.forEach((b: any) => {
                if (b.title) details += ` [Başlık: ${b.title}]`;
                if (b.subtitle) details += ` [Altbaşlık: ${b.subtitle}]`;
                if (b.items && Array.isArray(b.items)) {
                  b.items.forEach((item: any) => {
                    if (item.title) details += ` ${item.title}: ${item.desc || ''}`;
                  });
                }
              });
            }
            summaries.push(`Sayfa "${d.title}" (${d.path || '/'}): ${details.slice(0, 400)}`);
          }
        });
        if (summaries.length > 0) {
          setSiteContext(summaries.join('\n'));
        }
      } catch (e) {
        console.error("Error loading site context:", e);
      }
    };

    loadSettings();
    loadSiteContext();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const newMessages = [...messages, { role: 'user' as const, text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Rule-based fallback instead of AI
      const lowerInput = input.toLowerCase();
      let responseText = "Sorunuzu tam olarak anlayamadım. Lütfen hızlı iletişim formunu doldurarak veya aşağıdaki menüden ilgili sayfaları inceleyerek detaylı bilgi alabilirsiniz. [FORM_TEKLIFI]";
      
      const knowledge = ((settings?.knowledgeBase || '') + ' ' + (siteContext || '')).toLowerCase();
      
      if (lowerInput.includes('kampüs') || lowerInput.includes('okul') || lowerInput.includes('şube')) {
        responseText = "Kampüslerimiz: Dost Koleji İstanbul genelinde modern kampüsleri ile eğitim vermektedir. Size en yakın kampüsümüzü öğrenmek veya eğitim kademelerimiz (Anaokulu, İlkokul, Ortaokul, Lise) hakkında detaylı bilgi almak için lütfen 'Kampüslerimiz' sayfasını ziyaret edin veya iletişim formunu doldurun. [FORM_TEKLIFI]";
      } else if (lowerInput.includes('fiyat') || lowerInput.includes('ücret') || lowerInput.includes('kayıt')) {
        responseText = "Kayıt ve ücret bilgileri döneme ve eğitim kademesine göre değişiklik göstermektedir. Detaylı ve size özel bir fiyat teklifi alabilmek için lütfen kayıt formumuzu veya iletişim formumuzu doldurun, ilgili birimimiz size en kısa sürede ulaşacaktır. [FORM_TEKLIFI]";
      } else if (lowerInput.includes('iletişim') || lowerInput.includes('telefon') || lowerInput.includes('adres')) {
        responseText = "Bizimle iletişime geçmek için iletişim sayfamızı ziyaret edebilir veya hızlı iletişim formunu kullanabilirsiniz. [FORM_TEKLIFI]";
      } else if (lowerInput.includes('burs') || lowerInput.includes('sınav')) {
        responseText = "Bursluluk sınavlarımız ve güncel tarihler hakkında bilgi almak için 'Bursluluk Sınavı' sayfamızı ziyaret edebilir veya formu doldurarak detaylı bilgi talep edebilirsiniz. [FORM_TEKLIFI]";
      } else if (lowerInput.includes('merhaba') || lowerInput.includes('selam')) {
        responseText = "Merhaba! Size kurumumuz, kampüslerimiz ve eğitim programlarımız hakkında nasıl yardımcı olabilirim?";
      }

      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking delay

      let isForm = false;
      if (responseText.includes('[FORM_TEKLIFI]')) {
        responseText = responseText.replace('[FORM_TEKLIFI]', '').trim();
        isForm = true;
        openQuickContact();
      }

      setMessages(prev => [...prev, { role: 'assistant', text: responseText, isForm }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Hata oluştu. Lütfen tekrar deneyin.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formTitle = activeForm?.name || 'Hızlı İletişim Formu';
    const newDoc = {
      type: 'chat',
      status: 'new',
      createdAt: Date.now(),
      data: {
        formName: formTitle,
        ...formData
      }
    };

    // Construct formatted text for WhatsApp & Email with header Dost Koleji Veli Asistanı
    let notificationText = `*Dost Koleji Veli Asistanı* 🎓\n\n`;
    notificationText += `*Form:* ${formTitle}\n`;
    notificationText += `*Tarih:* ${new Date().toLocaleString('tr-TR')}\n\n`;
    notificationText += `*Müşteri / Veli Bilgileri:*\n`;
    Object.entries(formData).forEach(([k, v]) => {
      notificationText += `• *${k}:* ${v}\n`;
    });

    const targetEmail = settings?.email || 'yasinozbudak@gmail.com';

    // Trigger Notification automatically in background
    try {
      fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          text: notificationText
        })
      });
    } catch (err) {
      console.warn('Silent notification error:', err);
    }

    const tempLocalId = 'local_' + Date.now();
    const localItem = { id: tempLocalId, ...newDoc };

    // Always save to localStorage backup immediately
    try {
      const existingBackup = JSON.parse(localStorage.getItem('dost_forms_backup') || '[]');
      localStorage.setItem('dost_forms_backup', JSON.stringify([localItem, ...existingBackup]));
    } catch (err) {
      console.warn('Backup save error:', err);
    }

    try {
      const docRef = await addDoc(collection(db, 'forms'), newDoc);
      if (docRef?.id) {
        try {
          const backup = JSON.parse(localStorage.getItem('dost_forms_backup') || '[]');
          const updatedBackup = backup.map((item: any) => item.id === tempLocalId ? { ...item, id: docRef.id } : item);
          localStorage.setItem('dost_forms_backup', JSON.stringify(updatedBackup));
        } catch (e) {
          console.warn('Backup update error:', e);
        }
      }
    } catch (error) {
      console.error(error);
    }

    setFormSubmitted(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: 'İletişim talebiniz başarıyla alınmıştır. Eğitim danışmanlarımız en kısa sürede sizinle iletişime geçecektir. İlginize teşekkür ederiz.'
        }
      ]);
      setActiveForm(null);
      setFormData({});
    }, 1200);
  };

  const openQuickContact = () => {
    // If admin defined forms in settings, use the active one, or fallback to standard Hızlı İletişim Formu
    let formToUse = null;
    if (settings?.forms && settings.forms.length > 0) {
      formToUse = settings.forms.find((f: any) => f.active) || settings.forms[0];
    }

    if (!formToUse) {
      formToUse = {
        name: 'Hızlı İletişim Formu',
        fields: [
          { label: 'Adı Soyadı', key: 'Adı Soyadı', type: 'text', placeholder: 'Ad ve soyadınız', required: true },
          { label: 'Telefon Numarası', key: 'Telefon Numarası', type: 'tel', placeholder: '05XX XXX XX XX', required: true },
          { label: 'Kampüs Seçimi', key: 'Kampüs', type: 'select', options: ['Ümitköy Kampüsü', 'Oran Kampüsü', 'Eryaman Kampüsü'], required: true },
          { label: 'Eğitim Kademesi', key: 'Eğitim Kademesi', type: 'select', options: ['Anaokulu', 'İlkokul', 'Ortaokul', 'Lise'], required: true },
          { label: 'Mesajınız', key: 'Mesaj', type: 'textarea', placeholder: 'Sorunuz veya iletmek istediğiniz not...', required: false }
        ]
      };
    } else if (Array.isArray(formToUse.fields) && typeof formToUse.fields[0] === 'string') {
      // Convert legacy simple string array fields
      formToUse = {
        name: formToUse.name,
        fields: formToUse.fields.map((fName: string) => {
          const lower = fName.toLowerCase();
          if (lower.includes('kampüs')) {
            return { label: fName, key: fName, type: 'select', options: ['Ümitköy Kampüsü', 'Oran Kampüsü', 'Eryaman Kampüsü'], required: true };
          }
          if (lower.includes('kademe') || lower.includes('eğitim')) {
            return { label: fName, key: fName, type: 'select', options: ['Anaokulu', 'İlkokul', 'Ortaokul', 'Lise'], required: true };
          }
          if (lower.includes('telefon') || lower.includes('tel')) {
            return { label: fName, key: fName, type: 'tel', placeholder: '05XX XXX XX XX', required: true };
          }
          if (lower.includes('mesaj') || lower.includes('not')) {
            return { label: fName, key: fName, type: 'textarea', required: false };
          }
          return { label: fName, key: fName, type: 'text', required: true };
        })
      };
    }

    setActiveForm(formToUse);
    setFormSubmitted(false);
    setFormData({
      'Kampüs': 'Ümitköy Kampüsü',
      'Eğitim Kademesi': 'Anaokulu'
    });
  };

  if (settings && settings.isActive === false) return null;

  return (
    <>
      {/* Floating Button with Dost Koleji Dark Navy & Turquoise Blue Wave Animation */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
          {/* Wave / Ripple Rings */}
          <span className="absolute w-20 h-20 rounded-full bg-[#38C1D2]/35 animate-ping opacity-75"></span>
          <span className="absolute w-24 h-24 rounded-full bg-[#004899]/20 animate-pulse"></span>
          <span className="absolute w-28 h-28 rounded-full border-2 border-[#38C1D2]/40 animate-ping" style={{ animationDuration: '2.5s' }}></span>

          <button 
            onClick={() => setIsOpen(true)}
            className="relative w-18 h-18 bg-[#004899] border-2 border-[#38C1D2] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-all duration-300 group cursor-pointer"
            title="Veli Asistanı"
          >
            <img 
              src="/yelken_transparent.png" 
              alt="Dost Koleji Logo" 
              className="w-11 h-11 object-contain transition-transform group-hover:scale-110" 
            />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[390px] h-full sm:h-[620px] max-h-[100vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-200 overflow-hidden font-sans">
          {/* Header */}
          <div className="bg-[#004899] text-white p-4 flex items-center justify-between shrink-0 border-b border-[#38C1D2]/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-[#38C1D2]/50 p-1">
                <img src="/yelken_transparent.png" alt="Dost Koleji" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight text-white">Veli Asistanı</h3>
                <p className="text-[10px] text-[#38C1D2] flex items-center gap-1 font-semibold">
                  <span className="w-2 h-2 bg-[#38C1D2] rounded-full animate-pulse"></span>
                  Çevrimiçi
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white/80 hover:text-white" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
            <div className="text-center text-[10px] text-slate-400 font-bold tracking-widest my-2">Dost Koleji Canlı Destek</div>
            
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#004899] text-white rounded-tr-none shadow-sm' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                }`}>
                  <div className="markdown-body" translate="no">
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Form Rendering */}
            {activeForm && (
              <div className="w-full bg-white border border-[#38C1D2]/40 shadow-lg rounded-xl p-4 my-2 self-start">
                {formSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <CheckCircle2 className="w-12 h-12 text-[#38C1D2] mb-2 animate-bounce" />
                    <h4 className="font-bold text-slate-800 text-sm">Formunuz Alındı</h4>
                    <p className="text-xs text-slate-500 mt-1">Bilgileriniz kaydedilmiştir. Ekibimiz en kısa sürede sizinle iletişime geçecektir.</p>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-[#004899]">
                      <Menu className="w-4 h-4 text-[#38C1D2]" />
                      <h4 className="font-bold text-xs sm:text-sm">{activeForm.name}</h4>
                    </div>

                    {activeForm.fields.map((f: any, idx: number) => {
                      const fieldLabel = typeof f === 'string' ? f : f.label;
                      const fieldKey = typeof f === 'string' ? f : (f.key || f.label);
                      const fieldType = typeof f === 'string' ? 'text' : f.type;
                      const options = typeof f === 'object' ? f.options : null;
                      const isRequired = typeof f === 'object' ? f.required !== false : true;

                      return (
                        <div key={idx} className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600">
                            <span key={fieldLabel}>{fieldLabel}</span> {isRequired && <span key="req" className="text-red-500">*</span>}
                          </label>

                          {fieldType === 'select' ? (
                            <select
                              required={isRequired}
                              value={formData[fieldKey] || (options ? options[0] : '')}
                              onChange={e => setFormData({ ...formData, [fieldKey]: e.target.value })}
                              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38C1D2]"
                            >
                              {options?.map((opt: string) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : fieldType === 'textarea' ? (
                            <textarea
                              required={isRequired}
                              placeholder={f.placeholder || ''}
                              rows={2}
                              value={formData[fieldKey] || ''}
                              onChange={e => setFormData({ ...formData, [fieldKey]: e.target.value })}
                              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38C1D2]"
                            ></textarea>
                          ) : (
                            <input
                              type={fieldType || 'text'}
                              required={isRequired}
                              placeholder={f.placeholder || ''}
                              value={formData[fieldKey] || ''}
                              onChange={e => setFormData({ ...formData, [fieldKey]: e.target.value })}
                              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#38C1D2]"
                            />
                          )}
                        </div>
                      );
                    })}

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setActiveForm(null)}
                        className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                      >
                        İptal
                      </button>
                      <button 
                        type="submit" 
                        className="flex-1 py-2 bg-[#004899] text-white rounded-lg text-xs font-bold hover:bg-[#38C1D2] transition-colors"
                      >
                        Gönder
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
            
            {loading && (
              <div className="flex items-start">
                <div className="bg-white border border-slate-200 text-slate-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-[#38C1D2] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#004899] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#38C1D2] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {!activeForm && (
            <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              <button 
                onClick={openQuickContact} 
                className="shrink-0 px-3.5 py-1.5 bg-[#38C1D2] text-white rounded-full text-[11px] font-bold hover:bg-[#004899] transition-colors shadow-sm"
              >
                Hızlı İletişim Formu
              </button>
              <button 
                onClick={() => setInput('Kampüslerinizi ve eğitim kademelerinizi tanıtabilir misiniz?')} 
                className="shrink-0 px-3.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-full text-[11px] font-bold hover:bg-slate-200 transition-colors"
              >
                Kampüslerimiz
              </button>
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Bir soru sorun..." 
              className="flex-1 bg-slate-100 text-xs sm:text-sm px-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#38C1D2]"
              disabled={loading || activeForm != null}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading || activeForm != null}
              className="w-10 h-10 bg-[#004899] text-white rounded-full flex items-center justify-center hover:bg-[#38C1D2] transition-colors disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
