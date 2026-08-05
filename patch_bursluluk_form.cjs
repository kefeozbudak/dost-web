const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const targetStr = `const BurslulukExamFormBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const submitForm = async (formData: any) => {`;

const newStr = `const BurslulukExamFormBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const [burslulukActive, setBurslulukActive] = useState<boolean>(true);
  const [burslulukInactiveMessage, setBurslulukInactiveMessage] = useState<string>('');
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.burslulukActive !== undefined) {
            setBurslulukActive(data.burslulukActive);
            setBurslulukInactiveMessage(data.burslulukInactiveMessage || '');
          }
        }
      } catch (e) {
        console.error("Error fetching bursluluk settings", e);
      }
    };
    fetchSettings();
  }, []);

  const submitForm = async (formData: any) => {`;

file = file.replace(targetStr, newStr);

const targetRenderStr = `      <div className="bg-white rounded-xl md:rounded-3xl p-6 md:p-12 shadow-2xl relative z-10 border border-slate-100/50 max-w-4xl mx-auto backdrop-blur-sm">
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 md:p-4 bg-primary/5 rounded-2xl md:rounded-3xl mb-2 md:mb-4">
            <span className="material-symbols-outlined text-[#002147] text-3xl md:text-4xl" translate="no" aria-hidden="true">school</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-[#002147] tracking-tight uppercase" style={getTitleStyle(block)}>
            {block.title || "BURSLULUK SINAVI BAŞVURU FORMU"}
          </h2>
          {block.subtitle && (
            <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto font-medium" style={getSubtitleStyle(block)}>
              {block.subtitle}
            </p>
          )}
        </div>
        
        <DynamicFormBuilder block={block} type="bursluluk_exam_form" submitForm={submitForm} />
      </div>`;

const newRenderStr = `      <div className="bg-white rounded-xl md:rounded-3xl p-6 md:p-12 shadow-2xl relative z-10 border border-slate-100/50 max-w-4xl mx-auto backdrop-blur-sm">
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 md:p-4 bg-primary/5 rounded-2xl md:rounded-3xl mb-2 md:mb-4">
            <span className="material-symbols-outlined text-[#002147] text-3xl md:text-4xl" translate="no" aria-hidden="true">school</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-[#002147] tracking-tight uppercase" style={getTitleStyle(block)}>
            {block.title || "BURSLULUK SINAVI BAŞVURU FORMU"}
          </h2>
          {block.subtitle && (
            <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto font-medium" style={getSubtitleStyle(block)}>
              {block.subtitle}
            </p>
          )}
        </div>
        
        {burslulukActive ? (
          <DynamicFormBuilder block={block} type="bursluluk_exam_form" submitForm={submitForm} />
        ) : (
          <div className="text-center bg-blue-50 border border-blue-100 p-8 rounded-xl">
            <span className="material-symbols-outlined text-blue-500 text-5xl mb-4" translate="no" aria-hidden="true">info</span>
            <p className="text-lg text-slate-700 whitespace-pre-line leading-relaxed max-w-2xl mx-auto">
              {burslulukInactiveMessage || "Değerli Velimiz,\\n2026-2027 Eğitim-Öğretim yılı Bursluluk ve Kabul Sınavı başvuru sürecimiz şu an için aktif değildir. Yeni dönem sınav takvimimiz ve başvuru tarihlerimiz belirlendiğinde web sitemiz ve sosyal medya hesaplarımız üzerinden duyurulacaktır. Kurumumuza gösterdiğiniz değerli ilgi için teşekkür ederiz."}
            </p>
          </div>
        )}
      </div>`;

file = file.replace(targetRenderStr, newRenderStr);

fs.writeFileSync('./src/components/PageBlocks.tsx', file);
