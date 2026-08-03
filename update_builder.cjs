const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const startBuilder = code.indexOf("const DynamicFormBuilder =");
const endBuilder = code.indexOf("const ClubRegistrationFormBlock =");

const newBuilder = `const DynamicFormBuilder = ({ block, type, submitForm }: any) => {
  const defaultInputs = block.inputs || [];
  const [formData, setFormData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // set initial states
  useEffect(() => {
    const initData: any = {};
    if (defaultInputs.length > 0) {
      defaultInputs.forEach((inp: any) => {
        if (inp.type !== 'section_title') {
           initData[inp.name] = inp.type === 'checkbox' ? false : "";
        }
      });
      if (type === 'club_registration_form' && block.clubs?.length > 0) {
        initData['club'] = "";
      }
    }
    setFormData(initData);
  }, [block, defaultInputs, type]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (submitForm) {
        await submitForm(formData);
      } else {
        await addDoc(collection(db, "forms"), {
          type: type,
          createdAt: Date.now(),
          data: formData
        });
      }
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        // reset form
        const resetData: any = {};
        defaultInputs.forEach((inp: any) => {
          if (inp.type !== 'section_title') {
             resetData[inp.name] = inp.type === 'checkbox' ? false : "";
          }
        });
        if (type === 'club_registration_form') resetData['club'] = "";
        setFormData(resetData);
      }, 5000);
    } catch (error) {
      console.error("Form error:", error);
      alert("Bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={type === "club_registration_form" ? "bg-white border border-slate-200 rounded-xl p-6 md:p-10 shadow-sm relative" : "relative"} style={type === "club_registration_form" && block.styles?.cardBgColor ? { backgroundColor: block.styles.cardBgColor } : {}}>
      {submitted ? (
        <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Başvurunuz Alındı</h3>
          <p className="text-slate-600">Kayıt başvurunuz başarıyla alınmıştır.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          
          {defaultInputs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 border border-dashed border-slate-300 rounded-lg">
              Lütfen yönetim panelinden form alanlarını (inputlar) ekleyiniz.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {defaultInputs.map((input: any, i: number) => {
                const colSpan = (input.type === 'section_title' || input.type === 'textarea' || input.type === 'checkbox' || input.type === 'radio') ? 'md:col-span-2' : '';
                
                if (input.type === 'section_title') {
                  return (
                    <div key={i} className={\`flex items-center gap-2 border-b border-slate-100 pb-3 mt-4 first:mt-0 \${colSpan}\`}>
                      {input.icon && <span className="material-symbols-outlined text-[#1d4eca]">{input.icon}</span>}
                      <h2 className="text-xl font-bold text-slate-900">{input.label}</h2>
                    </div>
                  );
                }

                if (input.type === 'checkbox') {
                  return (
                    <div key={i} className={\`pt-2 \${colSpan}\`}>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-1">
                          <input 
                            type="checkbox" required={input.required} 
                            checked={!!formData[input.name]} 
                            onChange={e => handleChange(input.name, e.target.checked)}
                            className="peer h-5 w-5 rounded border-slate-300 text-[#1d4eca] focus:ring-[#1d4eca]/20 transition-all cursor-pointer" 
                          />
                        </div>
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
                          <span className="font-bold text-[#1d4eca]">{input.label.split(' ')[0]}</span> {input.label.substring(input.label.indexOf(' ') + 1)}
                        </span>
                      </label>
                    </div>
                  );
                }

                if (input.type === 'radio') {
                  const opts = (input.options || "").split(',').map((o: string) => o.trim());
                  return (
                    <div key={i} className={\`space-y-2 \${colSpan}\`}>
                      <label className="text-xs font-bold text-slate-700 block">{input.label}</label>
                      <div className="space-y-2">
                        {opts.map((opt: string, optIdx: number) => (
                          <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" name={input.name} value={opt} required={input.required}
                              checked={formData[input.name] === opt} 
                              onChange={e => handleChange(input.name, e.target.value)}
                              className="text-[#1d4eca] focus:ring-[#1d4eca]/20"
                            />
                            <span className="text-sm text-slate-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                if (input.type === 'textarea') {
                  return (
                    <div key={i} className={\`space-y-2 \${colSpan}\`}>
                      <label className="text-xs font-bold text-slate-700 block">{input.label}</label>
                      <textarea 
                        required={input.required} rows={4}
                        value={formData[input.name] || ''} onChange={e => handleChange(input.name, e.target.value)} 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none text-sm" 
                        placeholder={input.placeholder || ""}
                      />
                    </div>
                  );
                }

                if (input.type === 'select') {
                  const opts = (input.options || "").split(',').map((o: string) => o.trim());
                  return (
                    <div key={i} className={\`space-y-2 \${colSpan}\`}>
                      <label className="text-xs font-bold text-slate-700 block">{input.label}</label>
                      <select 
                        required={input.required} 
                        value={formData[input.name] || ''} onChange={e => handleChange(input.name, e.target.value)} 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none text-sm"
                      >
                        <option disabled value="">{input.placeholder || "Seçiniz"}</option>
                        {opts.map((opt: string, optIdx: number) => (
                          <option key={optIdx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  );
                }

                return (
                  <div key={i} className={\`space-y-2 \${colSpan}\`}>
                    <label className="text-xs font-bold text-slate-700 block">{input.label}</label>
                    <input 
                      type={input.type || "text"} required={input.required} 
                      value={formData[input.name] || ''} onChange={e => handleChange(input.name, e.target.value)} 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none text-sm" 
                      placeholder={input.placeholder || ""} 
                    />
                  </div>
                );
              })}
              
              {type === 'club_registration_form' && block.clubs && block.clubs.length > 0 && (
                <div className="md:col-span-2 space-y-6 mt-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <span className="material-symbols-outlined text-[#1d4eca]">explore</span>
                    <h2 className="text-xl font-bold text-slate-900">Kulüp Seçimi</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {block.clubs.map((clubOpt: any) => (
                      <div key={clubOpt.id} className="relative">
                        <input 
                          type="radio" name="club" id={\`club_\${clubOpt.id}\`} value={clubOpt.label} required
                          checked={formData.club === clubOpt.label} onChange={e => handleChange('club', e.target.value)}
                          className="peer hidden" 
                        />
                        <label 
                          htmlFor={\`club_\${clubOpt.id}\`}
                          className="flex flex-col items-center justify-center p-6 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 peer-checked:border-[#1d4eca] peer-checked:bg-[#1d4eca]/5 transition-all group h-full"
                        >
                          <span className={\`material-symbols-outlined text-4xl mb-3 transition-colors \${formData.club === clubOpt.label ? 'text-[#1d4eca]' : 'text-slate-400 group-hover:text-[#1d4eca]'}\`}>
                            {clubOpt.icon || 'explore'}
                          </span>
                          <span className="text-sm font-bold text-slate-900 text-center">{clubOpt.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-8 mt-4">
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
  );
};
`
code = code.substring(0, startBuilder) + newBuilder + code.substring(endBuilder);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
