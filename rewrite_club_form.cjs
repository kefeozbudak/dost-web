const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const startIndex = code.indexOf("const ClubRegistrationFormBlock =");
const endIndex = code.indexOf("const PreRegistrationFormBlock =");

if (startIndex !== -1 && endIndex !== -1) {
    const oldBlock = code.substring(startIndex, endIndex);
    
    const newBlock = `const ClubRegistrationFormBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentCampus: "",
    studentClass: "",
    club: "",
    parentName: "",
    parentPhone: "",
    kvkkConsent: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kvkkConsent) {
      alert("KVKK Aydınlatma Metni'ni onaylamanız gerekmektedir.");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "forms"), {
        type: "club_registration_form",
        createdAt: Date.now(),
        data: formData
      });
      setSubmitted(true);
      setFormData({
        studentName: "", studentCampus: "", studentClass: "", club: "",
        parentName: "", parentPhone: "", kvkkConsent: false
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Form error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section key={index} className="py-section-gap w-full flex items-center justify-center p-4 md:p-8" style={getStyle(block, "container")}>
      <div className="w-full max-w-[640px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1d4eca] mb-2">{block.title || "Dost Koleji"}</h1>
          <p className="text-lg text-slate-500">{block.subtitle || "Öğrenci Kulüp Kayıt Portalı"}</p>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-10 shadow-sm relative">
          {submitted ? (
            <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Başvurunuz Alındı</h3>
              <p className="text-slate-600">Kulüp kayıt başvurunuz başarıyla alınmıştır.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="material-symbols-outlined text-[#1d4eca]">person</span>
                  <h2 className="text-xl font-bold text-slate-900">Öğrenci Bilgileri</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Adı Soyadı</label>
                    <input 
                      type="text" required 
                      value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none" 
                      placeholder="Örn: Ahmet Yılmaz" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Kampüs Seçimi</label>
                    <select 
                      required 
                      value={formData.studentCampus} onChange={e => setFormData({...formData, studentCampus: e.target.value})} 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none"
                    >
                      <option disabled value="">Kampüs Seçiniz</option>
                      <option value="eryaman">Eryaman Kampüsü</option>
                      <option value="oran">Oran Kampüsü</option>
                      <option value="umitkoy">Ümitköy Kampüsü</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Sınıfı</label>
                    <select 
                      required 
                      value={formData.studentClass} onChange={e => setFormData({...formData, studentClass: e.target.value})} 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none"
                    >
                      <option disabled value="">Sınıf Seçiniz</option>
                      <optgroup label="İlkokul">
                        <option value="1">1. Sınıf</option>
                        <option value="2">2. Sınıf</option>
                        <option value="3">3. Sınıf</option>
                        <option value="4">4. Sınıf</option>
                      </optgroup>
                      <optgroup label="Ortaokul">
                        <option value="5">5. Sınıf</option>
                        <option value="6">6. Sınıf</option>
                        <option value="7">7. Sınıf</option>
                        <option value="8">8. Sınıf</option>
                      </optgroup>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="material-symbols-outlined text-[#1d4eca]">explore</span>
                  <h2 className="text-xl font-bold text-slate-900">Kulüp Seçimi</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: 'spor', icon: 'sports_basketball', label: 'Spor' },
                    { id: 'sanat', icon: 'palette', label: 'Sanat' },
                    { id: 'bilim', icon: 'biotech', label: 'Bilim' },
                    { id: 'muzik', icon: 'music_note', label: 'Müzik' },
                    { id: 'robotik', icon: 'smart_toy', label: 'Robotik' },
                    { id: 'drama', icon: 'theater_comedy', label: 'Drama' },
                  ].map((clubOpt) => (
                    <div key={clubOpt.id} className="relative">
                      <input 
                        type="radio" name="club" id={\`club_\${clubOpt.id}\`} value={clubOpt.id} required
                        checked={formData.club === clubOpt.id} onChange={e => setFormData({...formData, club: e.target.value})}
                        className="peer hidden" 
                      />
                      <label 
                        htmlFor={\`club_\${clubOpt.id}\`}
                        className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 peer-checked:border-[#1d4eca] peer-checked:bg-[#1d4eca]/5 transition-all group"
                      >
                        <span className={\`material-symbols-outlined text-3xl mb-2 transition-colors \${formData.club === clubOpt.id ? 'text-[#1d4eca]' : 'text-slate-400 group-hover:text-[#1d4eca]'}\`}>
                          {clubOpt.icon}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 text-center">{clubOpt.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="material-symbols-outlined text-[#1d4eca]">contact_phone</span>
                  <h2 className="text-xl font-bold text-slate-900">Veli İletişim Bilgileri</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Veli Adı Soyadı</label>
                    <input 
                      type="text" required 
                      value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none" 
                      placeholder="Örn: Mehmet Yılmaz" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">Telefon Numarası</label>
                    <input 
                      type="tel" required 
                      value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none" 
                      placeholder="0(5xx) xxx xx xx" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative mt-1">
                    <input 
                      type="checkbox" required 
                      checked={formData.kvkkConsent} onChange={e => setFormData({...formData, kvkkConsent: e.target.checked})}
                      className="peer h-5 w-5 rounded border-slate-300 text-[#1d4eca] focus:ring-[#1d4eca]/20 transition-all cursor-pointer" 
                    />
                  </div>
                  <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                    <span className="font-bold text-[#1d4eca]">KVKK</span> Aydınlatma Metni'ni okudum, kişisel verilerimin kulüp kaydı amacıyla işlenmesini onaylıyorum.
                  </span>
                </label>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-4 bg-[#1d4eca] text-white font-bold text-sm rounded-lg hover:bg-blue-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitting ? 'İşleniyor...' : 'Kaydı Tamamla'}
                  {!submitting && <span className="material-symbols-outlined">send</span>}
                  {submitting && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
\n`;
    
    code = code.replace(oldBlock, newBlock);
    fs.writeFileSync('src/components/PageBlocks.tsx', code);
    console.log("Replaced successfully by string index!");
} else {
    console.log("Could not find start or end index.");
}
