const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const clubFormBlock = `
const ClubRegistrationFormBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const [formData, setFormData] = useState({
    studentName: "",
    studentCampus: "",
    studentClass: "",
    club: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    notes: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // db ve collection firebase/firestore'dan import edildiğini varsayıyoruz. Zaten PageBlocks'ta var.
      await addDoc(collection(db, "forms"), {
        type: "club_registration_form",
        createdAt: Date.now(),
        data: formData
      });
      setSubmitted(true);
      setFormData({
        studentName: "", studentCampus: "", studentClass: "", club: "",
        parentName: "", parentPhone: "", parentEmail: "", notes: ""
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
    <section
      key={index}
      className="py-section-gap w-full flex items-center justify-center p-4 md:p-8"
      style={{ backgroundColor: block.styles?.backgroundColor || '#f6f6f8', ...getStyle(block, "container") }}
    >
      <div className="w-full max-w-4xl bg-surface-card rounded-lg shadow-sm border border-border-subtle overflow-hidden relative pb-2" style={block.styles?.cardBgColor ? { backgroundColor: block.styles.cardBgColor } : {}}>
        
        {/* Header */}
        <div 
          className="p-8 md:p-12 text-center relative overflow-hidden"
          style={{ backgroundColor: block.styles?.headerBgColor || '#002147' }}
        >
          <div className="relative z-10">
            <h1 
              className="font-headline-md text-headline-md text-white mb-2 uppercase tracking-wide"
              style={getTitleStyle(block)}
            >
              {block.title || "KULÜP KAYIT FORMU"}
            </h1>
            <p 
              className="font-body-md text-body-md text-blue-200"
              style={getSubtitleStyle(block)}
            >
              {block.subtitle || "Lütfen Formu Eksiksiz Doldurunuz."}
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-16 bg-[#2b5ec9] rounded-full" style={block.styles?.titlePart1Color ? { backgroundColor: block.styles.titlePart1Color } : {}}></div>
            </div>
          </div>
        </div>
        
        {submitted ? (
          <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Başvurunuz Alındı</h3>
            <p className="text-slate-600">Kulüp kayıt başvurunuz başarıyla alınmıştır. En kısa sürede sizinle iletişime geçilecektir.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10 relative">
            
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-2">
                <span className="material-symbols-outlined text-[#2b5ec9]">school</span>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">ÖĞRENCİ BİLGİLERİ</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Öğrenci Adı Soyadı</label>
                  <input type="text" required value={formData.studentName} onChange={e => setFormData({...formData, studentName: e.target.value})} className="w-full px-4 py-3 border border-border-subtle rounded-md focus:ring-2 focus:ring-[#2b5ec9] focus:border-[#2b5ec9] outline-none transition-all bg-slate-50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Kampüs</label>
                  <select required value={formData.studentCampus} onChange={e => setFormData({...formData, studentCampus: e.target.value})} className="w-full px-4 py-3 border border-border-subtle rounded-md focus:ring-2 focus:ring-[#2b5ec9] focus:border-[#2b5ec9] outline-none transition-all bg-slate-50 text-sm">
                    <option value="">Seçiniz</option>
                    <option value="Eryaman Kampüsü">Eryaman Kampüsü</option>
                    <option value="Oran Kampüsü">Oran Kampüsü</option>
                    <option value="Ümitköy Kampüsü">Ümitköy Kampüsü</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Sınıf</label>
                  <input type="text" required value={formData.studentClass} onChange={e => setFormData({...formData, studentClass: e.target.value})} className="w-full px-4 py-3 border border-border-subtle rounded-md focus:ring-2 focus:ring-[#2b5ec9] focus:border-[#2b5ec9] outline-none transition-all bg-slate-50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Seçilen Kulüp</label>
                  <input type="text" required value={formData.club} onChange={e => setFormData({...formData, club: e.target.value})} className="w-full px-4 py-3 border border-border-subtle rounded-md focus:ring-2 focus:ring-[#2b5ec9] focus:border-[#2b5ec9] outline-none transition-all bg-slate-50 text-sm" />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-2">
                <span className="material-symbols-outlined text-[#2b5ec9]">person</span>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">VELİ BİLGİLERİ</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Veli Adı Soyadı</label>
                  <input type="text" required value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} className="w-full px-4 py-3 border border-border-subtle rounded-md focus:ring-2 focus:ring-[#2b5ec9] focus:border-[#2b5ec9] outline-none transition-all bg-slate-50 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2">Veli Telefon Numarası</label>
                  <input type="tel" required value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} className="w-full px-4 py-3 border border-border-subtle rounded-md focus:ring-2 focus:ring-[#2b5ec9] focus:border-[#2b5ec9] outline-none transition-all bg-slate-50 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-2">Veli E-posta Adresi</label>
                  <input type="email" value={formData.parentEmail} onChange={e => setFormData({...formData, parentEmail: e.target.value})} className="w-full px-4 py-3 border border-border-subtle rounded-md focus:ring-2 focus:ring-[#2b5ec9] focus:border-[#2b5ec9] outline-none transition-all bg-slate-50 text-sm" />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-2">
                <span className="material-symbols-outlined text-[#2b5ec9]">edit_note</span>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">EKLENMEK İSTENEN NOTLAR</h3>
              </div>
              <div>
                <textarea rows={4} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full px-4 py-3 border border-border-subtle rounded-md focus:ring-2 focus:ring-[#2b5ec9] focus:border-[#2b5ec9] outline-none transition-all bg-slate-50 text-sm"></textarea>
              </div>
            </section>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#2b5ec9] hover:bg-[#1d4eca] text-white font-bold py-4 px-10 rounded-full transition-colors flex items-center gap-2"
                style={block.styles?.titlePart1Color ? { backgroundColor: block.styles.titlePart1Color } : {}}
              >
                {submitting ? 'Gönderiliyor...' : 'Gönder'}
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
            
          </form>
        )}
      </div>
    </section>
  );
};
`;

if (code.indexOf("const ClubRegistrationFormBlock =") === -1) {
    // Insert before PreRegistrationFormBlock or at the end
    const anchor = "const PreRegistrationFormBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {";
    code = code.replace(anchor, clubFormBlock + '\n\n' + anchor);
    fs.writeFileSync('src/components/PageBlocks.tsx', code);
    console.log("Added ClubRegistrationFormBlock successfully!");
} else {
    console.log("ClubRegistrationFormBlock already exists.");
}
