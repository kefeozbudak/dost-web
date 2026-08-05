const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

// Ensure firebase/storage is imported if not already.
if (!file.includes('firebase/storage')) {
  file = file.replace(/import { db } from "\.\.\/lib\/firebase";/, "import { db, storage } from \"../lib/firebase\";\nimport { ref, uploadBytes, getDownloadURL } from \"firebase/storage\";");
}

const careerBlocks = `
const CareerHeroBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section key={index} className="relative w-full rounded-2xl overflow-hidden min-h-[400px] flex items-center justify-center mb-8" style={getStyle(block, "container")}>
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ backgroundImage: \`url(\${block.image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80'})\` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#002147]/90 to-[#1d4eca]/80"></div>
      <div className="relative z-10 text-center px-6 py-16 md:py-24 text-white max-w-3xl mx-auto">
        <h1 className="font-display-lg text-[32px] md:text-[48px] font-black text-white mb-6 leading-[1.2] tracking-tight" style={getTitleStyle(block)}>
          {block.title || "Dost Koleji'nde Kariyer"}
        </h1>
        <p className="font-body-lg text-[18px] text-white/90 mb-8 max-w-2xl mx-auto" style={getSubtitleStyle(block)}>
          {block.subtitle || "Akademik mükemmelliğe, sürekli gelişime ve huzurlu, profesyonel bir ortamda geleceği şekillendirmeye kararlı bir ekibe katılın."}
        </p>
        <a 
          href="#application-form"
          className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-yellow-500 text-[#002147] font-bold text-[14px] px-8 py-3 rounded-full transition-colors shadow-sm"
        >
          <span>{block.buttonText || "Açık Pozisyonları Görüntüle"}</span>
          <span className="material-symbols-outlined" translate="no" aria-hidden="true">arrow_downward</span>
        </a>
      </div>
    </section>
  );
};

const CareerBenefitsBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [
    { title: 'Sürekli Gelişim', desc: 'Eğitim sektöründe sürekli eğitim, atölye çalışmaları ve mesleki gelişim fırsatları ile personelimize yatırım yapıyoruz.', icon: 'psychology', iconColor: 'text-primary', iconBg: 'bg-primary/10' },
    { title: 'Kurumsal Güven', desc: 'Dürüstlük ve istikrar temeli üzerine kurulmuş, güvenebileceğiniz güvenli ve şeffaf bir çalışma ortamı sunuyoruz.', icon: 'verified_user', iconColor: 'text-[#D4AF37]', iconBg: 'bg-yellow-100', borderTop: 'border-t-4 border-t-[#D4AF37]' },
    { title: 'Huzurlu Ortam', desc: 'Kampüslerimiz hem öğrenciler hem de personel için refah, işbirliği ve uyumlu bir atmosferi teşvik etmek üzere tasarlanmıştır.', icon: 'spa', iconColor: 'text-emerald-700', iconBg: 'bg-emerald-100' }
  ];

  return (
    <section key={index} className="w-full px-4 md:px-0 mb-16" style={getStyle(block, "container")}>
      <div className="text-center mb-12">
        <h2 className="font-bold text-[28px] md:text-[36px] text-[#002147] mb-4" style={getTitleStyle(block)}>
          {block.title || "Neden Bize Katılmalısınız?"}
        </h2>
        <p className="font-normal text-[16px] text-slate-500 max-w-2xl mx-auto" style={getSubtitleStyle(block)}>
          {block.subtitle || "Dost Koleji ailesinin bir parçası olmanın avantajlarını keşfedin."}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item: any, i: number) => (
          <div key={i} className={\`bg-white border border-slate-200 rounded-xl p-6 transition-transform hover:-translate-y-1 hover:shadow-md \${item.borderTop || ''}\`}>
            <div className={\`w-12 h-12 rounded-full flex items-center justify-center mb-4 \${item.iconBg || 'bg-slate-100'} \${item.iconColor || 'text-slate-700'}\`}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }} translate="no" aria-hidden="true">{item.icon || 'star'}</span>
            </div>
            <h3 className="font-bold text-[20px] text-slate-900 mb-2">{item.title}</h3>
            <p className="font-normal text-[16px] text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const CareerApplicationBlock = ({ block, index, getStyle, getTitleStyle }: any) => {
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

  const items = block.items || [
    { title: 'Matematik Öğretmeni', type: 'TAM ZAMANLI', dept: 'Lise Bölümü', val: 'math_teacher' },
    { title: 'Akademik Koordinatör', type: 'TAM ZAMANLI', dept: 'Yönetim', val: 'academic_coordinator' },
    { title: 'Rehber Danışman', type: 'YARI ZAMANLI', dept: 'Öğrenci Hizmetleri', val: 'guidance_counselor' }
  ];

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.position || !formData.kvkk || !file) {
      alert("Lütfen tüm zorunlu alanları doldurun ve CV'nizi yükleyin.");
      return;
    }

    setIsSubmitting(true);
    try {
      let cvUrl = '';
      if (file) {
        const fileRef = ref(storage, \`cv_uploads/\${Date.now()}_\${file.name}\`);
        await uploadBytes(fileRef, file);
        cvUrl = await getDownloadURL(fileRef);
      }

      const formPayload = {
        type: 'is_basvuru_formu',
        formName: 'İş Başvuru Formu',
        createdAt: Date.now(),
        data: {
          ...formData,
          cvUrl,
          fileName: file.name
        }
      };

      await addDoc(collection(db, "forms"), formPayload);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Başvuru gönderilirken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section key={index} id="application-form" className="w-full px-4 md:px-0 mb-16" style={getStyle(block, "container")}>
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
            <span className="material-symbols-outlined text-4xl" translate="no" aria-hidden="true">check_circle</span>
          </div>
          <h2 className="text-3xl font-bold text-[#002147] mb-4">Başvurunuz Alındı!</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">Kariyer başvurunuz başarıyla sistemimize iletilmiştir. Özgeçmişiniz incelendikten sonra uygun bulunması halinde sizinle iletişime geçilecektir.</p>
          <button onClick={() => { setIsSuccess(false); setFormData({firstName:'', lastName:'', email:'', phone:'', position:'', coverLetter:'', kvkk:false}); setFile(null); }} className="bg-[#002147] text-white px-8 py-3 rounded-lg font-bold">Yeni Başvuru Yap</button>
        </div>
      </section>
    );
  }

  return (
    <section key={index} id="application-form" className="w-full px-4 md:px-0 mb-16" style={getStyle(block, "container")}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Open Positions */}
        <div className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-[24px] text-[#002147] mb-6" style={getTitleStyle(block)}>
              {block.title || "Mevcut Açık Pozisyonlar"}
            </h3>
            <div className="flex flex-col gap-4">
              {items.map((item: any, i: number) => (
                <div key={i} onClick={() => setFormData({...formData, position: item.val})} className={\`p-4 rounded-lg border transition-all cursor-pointer group \${formData.position === item.val ? 'bg-primary/5 border-primary/40' : 'bg-[#faf8ff] border-transparent hover:border-primary/20 hover:bg-primary/5'}\`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-[14px] text-slate-900 group-hover:text-primary">{item.title}</h4>
                    <span className="bg-primary/10 text-primary font-bold text-[10px] tracking-wider px-2 py-1 rounded">{item.type}</span>
                  </div>
                  <p className="font-normal text-[16px] text-slate-500 text-sm mb-3">{item.dept}</p>
                  <div className="flex items-center gap-1 text-primary text-sm font-bold group-hover:underline">
                    <span>{formData.position === item.val ? 'Seçildi' : 'Seç'}</span>
                    <span className="material-symbols-outlined text-[16px]" translate="no" aria-hidden="true">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column: Application Form */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 shadow-sm">
            <div className="mb-8">
              <h2 className="font-bold text-[36px] text-slate-900 mb-2">Başvuru Formu</h2>
              <p className="font-normal text-[16px] text-slate-500">Lütfen bir pozisyona başvurmak için aşağıdaki formu doldurun. * ile işaretli alanların doldurulması zorunludur.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[14px] text-slate-900">Ad *</label>
                  <input required type="text" placeholder="örn. Ayşe" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full border border-slate-200 rounded-lg p-3 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[14px] text-slate-900">Soyad *</label>
                  <input required type="text" placeholder="örn. Yılmaz" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full border border-slate-200 rounded-lg p-3 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[14px] text-slate-900">E-posta Adresi *</label>
                  <input required type="email" placeholder="ayse.yilmaz@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full border border-slate-200 rounded-lg p-3 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-bold text-[14px] text-slate-900">Telefon Numarası *</label>
                  <input required type="tel" placeholder="+90 (555) 123 45 67" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full border border-slate-200 rounded-lg p-3 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[14px] text-slate-900">Pozisyon Seçin *</label>
                <div className="relative">
                  <select required value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="w-full border border-slate-200 rounded-lg p-3 bg-white appearance-none outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                    <option value="" disabled>Bir rol seçin...</option>
                    {items.map((item: any, i: number) => (
                      <option key={i} value={item.val}>{item.title}</option>
                    ))}
                    <option value="general">Genel Başvuru</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">expand_more</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[14px] text-slate-900">CV Yükle *</label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-8 bg-[#faf8ff] hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center group cursor-pointer overflow-hidden">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined" translate="no" aria-hidden="true">upload_file</span>
                  </div>
                  <p className="font-bold text-[14px] text-slate-900 mb-1">{file ? file.name : 'Yüklemek için tıklayın veya sürükleyip bırakın'}</p>
                  <p className="font-normal text-[16px] text-slate-500 text-sm">PDF, DOCX 10MB'a kadar</p>
                  <input type="file" required accept=".pdf,.doc,.docx" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="font-bold text-[14px] text-slate-900">Ön Yazı / Ek Mesaj</label>
                <textarea rows={4} value={formData.coverLetter} onChange={(e) => setFormData({...formData, coverLetter: e.target.value})} placeholder="Neden harika bir uyum sağlayacağınızı bize anlatın..." className="w-full border border-slate-200 rounded-lg p-3 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"></textarea>
              </div>
              
              <div className="pt-4 border-t border-slate-200 mt-2 flex flex-col gap-6">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5 mt-0.5">
                    <input type="checkbox" required checked={formData.kvkk} onChange={(e) => setFormData({...formData, kvkk: e.target.checked})} className="w-5 h-5 rounded border-slate-400 text-primary focus:ring-primary/20 cursor-pointer" />
                  </div>
                  <span className="font-normal text-[14px] text-slate-500 leading-tight">
                    Kişisel verilerimin işe alım süreçleri kapsamında işlenmesine ilişkin <a href="#" className="text-primary hover:underline font-bold">{kvkkTitle}'ni</a> okudum ve kabul ediyorum. *
                  </span>
                </label>
                <div className="flex justify-end">
                  <button type="submit" disabled={isSubmitting} className="bg-[#002147] hover:bg-primary text-white font-bold text-[14px] px-8 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50">
                    <span>{isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}</span>
                    {!isSubmitting && <span className="material-symbols-outlined text-[18px]" translate="no" aria-hidden="true">send</span>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
`;

const switchStatement = `
        case "career_hero":
          return <CareerHeroBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} getSubtitleStyle={getSubtitleStyle} />;
        case "career_benefits":
          return <CareerBenefitsBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} getSubtitleStyle={getSubtitleStyle} />;
        case "career_application":
          return <CareerApplicationBlock key={index} block={block} index={index} getStyle={getStyle} getTitleStyle={getTitleStyle} />;
`;

file = file.replace(/const DynamicFormBuilder =/g, careerBlocks + "\nconst DynamicFormBuilder =");
file = file.replace(/default:/, switchStatement + "\n        default:");

fs.writeFileSync('./src/components/PageBlocks.tsx', file);
