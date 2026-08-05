const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

// Find the start of CareerApplicationBlock
const startIdx = file.indexOf('const CareerApplicationBlock =');

// Let's replace from startIdx to const EduSystemHeroBlock with the proper CareerApplicationBlock closure.
const endIdx = file.indexOf('const EduSystemHeroBlock =');

if (startIdx !== -1 && endIdx !== -1) {
  const careerApplicationBlockContent = `const CareerApplicationBlock = ({ block, index, getStyle, getTitleStyle }: any) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    coverLetter: '',
    kvkk: false
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [kvkkTitle, setKvkkTitle] = useState('KVKK Aydınlatma Metni Onayı');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().kvkkTitle) {
          setKvkkTitle(docSnap.data().kvkkTitle);
        }
      } catch(e) {}
    };
    fetchSettings();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.kvkk) {
      alert("Lütfen KVKK Aydınlatma Metni'ni onaylayın.");
      return;
    }
    setIsSubmitting(true);
    try {
      setIsSuccess(true);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', position: '', coverLetter: '', kvkk: false });
      setFile(null);
    } catch(err) {
      alert("Başvuru gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const positions = block.items || [];
  
  return (
    <section key={index} id="application-form" className="w-full px-4 md:px-0 mb-16" style={getStyle(block, "container")}>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-[#002147] px-8 py-6 text-white text-center">
          <h2 className="font-bold text-[24px]" style={getTitleStyle(block)}>{block.title || "İş Başvurusu"}</h2>
          <p className="text-white/80 mt-2">Dost Koleji ailesine katılmak için formu doldurun</p>
        </div>
        <div className="p-8">
          {isSuccess ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-3xl" translate="no" aria-hidden="true">check</span>
              </div>
              <h3 className="font-bold text-2xl text-slate-800 mb-2">Başvurunuz Alındı</h3>
              <p className="text-slate-600 mb-6">İlginiz için teşekkür ederiz. Başvurunuz başarıyla sistemimize kaydedilmiştir.</p>
              <button onClick={() => setIsSuccess(false)} className="bg-[#002147] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#002147]/90 transition-colors">
                Yeni Başvuru Yap
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Adınız *</label>
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Soyadınız *</label>
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">E-posta *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Telefon *</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Başvurduğunuz Pozisyon *</label>
                <select name="position" required value={formData.position} onChange={handleChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#002147] outline-none transition-colors">
                  <option value="">Seçiniz</option>
                  {positions.map((pos, idx) => (
                    <option key={idx} value={pos.title || pos.label}>{pos.title || pos.label}</option>
                  ))}
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div className="flex items-start gap-3 mt-6">
                <input type="checkbox" id="kvkk" name="kvkk" checked={formData.kvkk} onChange={handleChange} required className="mt-1 text-[#002147]" />
                <label htmlFor="kvkk" className="text-sm text-slate-600">
                  <a href="/kvkk" target="_blank" className="text-[#002147] underline font-medium">KVKK Aydınlatma Metni</a>'ni okudum. *
                </label>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-[#002147] text-white font-bold py-3 px-4 rounded-lg mt-4 disabled:opacity-70">
                {isSubmitting ? "Gönderiliyor..." : "Başvuruyu Tamamla"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

`;
  
  const before = file.substring(0, startIdx);
  const after = file.substring(endIdx);
  
  fs.writeFileSync('./src/components/PageBlocks.tsx', before + careerApplicationBlockContent + after);
}

