const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Replace ClubRegistrationFormBlock
const newClubBlock = `
const DynamicFormBuilder = ({ block, type, submitForm }: any) => {
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
  }, [block]);

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
    <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-10 shadow-sm relative" style={block.styles?.cardBgColor ? { backgroundColor: block.styles.cardBgColor } : {}}>
      {submitted ? (
        <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Başvurunuz Alındı</h3>
          <p className="text-slate-600">Kayıt başvurunuz başarıyla alınmıştır.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {defaultInputs.length === 0 ? (
            <div className="p-6 text-center text-slate-500 border border-dashed border-slate-300 rounded-lg">
              Lütfen yönetim panelinden form alanlarını (inputlar) ekleyiniz.
            </div>
          ) : (
            <div className="space-y-6">
              {defaultInputs.map((input: any, i: number) => {
                if (input.type === 'section_title') {
                  return (
                    <div key={i} className="flex items-center gap-2 border-b border-slate-200 pb-3 mt-8 first:mt-0">
                      {input.icon && <span className="material-symbols-outlined text-[#1d4eca]">{input.icon}</span>}
                      <h2 className="text-xl font-bold text-slate-900">{input.label}</h2>
                    </div>
                  );
                }

                if (input.type === 'checkbox') {
                  return (
                    <div key={i} className="pt-2">
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
                          {input.label}
                        </span>
                      </label>
                    </div>
                  );
                }

                if (input.type === 'radio') {
                  const opts = (input.options || "").split(',').map((o: string) => o.trim());
                  return (
                    <div key={i} className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 block">{input.label}</label>
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
                    <div key={i} className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 block">{input.label}</label>
                      <textarea 
                        required={input.required} rows={4}
                        value={formData[input.name] || ''} onChange={e => handleChange(input.name, e.target.value)} 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none" 
                        placeholder={input.placeholder || ""}
                      />
                    </div>
                  );
                }

                if (input.type === 'select') {
                  const opts = (input.options || "").split(',').map((o: string) => o.trim());
                  return (
                    <div key={i} className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 block">{input.label}</label>
                      <select 
                        required={input.required} 
                        value={formData[input.name] || ''} onChange={e => handleChange(input.name, e.target.value)} 
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none"
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
                  <div key={i} className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 block">{input.label}</label>
                    <input 
                      type={input.type || "text"} required={input.required} 
                      value={formData[input.name] || ''} onChange={e => handleChange(input.name, e.target.value)} 
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 focus:border-[#1d4eca] focus:ring-2 focus:ring-[#1d4eca]/20 transition-all outline-none" 
                      placeholder={input.placeholder || ""} 
                    />
                  </div>
                );
              })}
            </div>
          )}

          {type === 'club_registration_form' && block.clubs && block.clubs.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <span className="material-symbols-outlined text-[#1d4eca]">explore</span>
                <h2 className="text-xl font-bold text-slate-900">Kulüp Seçimi</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {block.clubs.map((clubOpt: any) => (
                  <div key={clubOpt.id} className="relative">
                    <input 
                      type="radio" name="club" id={\`club_\${clubOpt.id}\`} value={clubOpt.label} required
                      checked={formData.club === clubOpt.label} onChange={e => handleChange('club', e.target.value)}
                      className="peer hidden" 
                    />
                    <label 
                      htmlFor={\`club_\${clubOpt.id}\`}
                      className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 peer-checked:border-[#1d4eca] peer-checked:bg-[#1d4eca]/5 transition-all group"
                    >
                      <span className={\`material-symbols-outlined text-3xl mb-2 transition-colors \${formData.club === clubOpt.label ? 'text-[#1d4eca]' : 'text-slate-400 group-hover:text-[#1d4eca]'}\`}>
                        {clubOpt.icon || 'explore'}
                      </span>
                      <span className="text-sm font-semibold text-slate-900 text-center">{clubOpt.label}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

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
  );
};

const ClubRegistrationFormBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  return (
    <section key={index} className="py-section-gap w-full flex items-center justify-center p-4 md:p-8" style={getStyle(block, "container")}>
      <div className="w-full max-w-[640px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1d4eca] mb-2">{block.title || "Dost Koleji"}</h1>
          <p className="text-lg text-slate-500">{block.subtitle || "Öğrenci Kulüp Kayıt Portalı"}</p>
        </div>
        <DynamicFormBuilder block={block} type="club_registration_form" />
      </div>
    </section>
  );
};
`;

const newPreBlock = `
const PreRegistrationFormBlock = ({ block, index, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const submitForm = async (formData: any) => {
    if (block.webhookUrl) {
      try {
        await fetch(block.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (e) {
        console.error("Webhook error", e);
      }
    }
    await addDoc(collection(db, "forms"), {
      type: "pre_registration_form",
      createdAt: Date.now(),
      data: formData
    });
  };

  return (
    <section key={index} className="py-section-gap w-full flex items-center justify-center p-4 md:p-8" style={getStyle(block, "container")}>
      <div className="w-full max-w-4xl bg-surface-card rounded-lg shadow-sm border border-border-subtle overflow-hidden relative pb-2" style={block.styles?.cardBgColor ? { backgroundColor: block.styles.cardBgColor } : {}}>
        
        {/* Header */}
        <div className="p-8 md:p-12 text-center relative overflow-hidden" style={{ backgroundColor: block.styles?.headerBgColor || '#002147' }}>
          <div className="relative z-10">
            <h1 className="font-headline-md text-headline-md text-white mb-2 uppercase tracking-wide" style={getTitleStyle(block)}>
              {block.title || "ÖĞRENCİ ÖN KAYIT FORMU"}
            </h1>
            <p className="font-body-md text-body-md text-blue-200" style={getSubtitleStyle(block)}>
              {block.subtitle || "Lütfen Formu Eksiksiz Doldurunuz."}
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-1 w-16 bg-[#2b5ec9] rounded-full" style={block.styles?.titlePart1Color ? { backgroundColor: block.styles.titlePart1Color } : {}}></div>
            </div>
          </div>
        </div>
        
        <div className="p-8 md:p-12">
          <DynamicFormBuilder block={block} type="pre_registration_form" submitForm={submitForm} />
        </div>
      </div>
    </section>
  );
};
`;


// I need to replace ClubRegistrationFormBlock entirely.
const clubStart = code.indexOf("const ClubRegistrationFormBlock =");
const clubEnd = code.indexOf("const PreRegistrationFormBlock =");

if (clubStart !== -1 && clubEnd !== -1) {
    code = code.substring(0, clubStart) + newClubBlock + "\n\n" + code.substring(clubEnd);
    fs.writeFileSync('src/components/PageBlocks.tsx', code);
    console.log("ClubRegistrationFormBlock replaced.");
} else {
    console.log("Could not find ClubRegistrationFormBlock");
}

code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');
const preStart = code.indexOf("const PreRegistrationFormBlock =");
const preEnd = code.indexOf("const ContactFormBlock =");

if (preStart !== -1 && preEnd !== -1) {
    code = code.substring(0, preStart) + newPreBlock + "\n\n" + code.substring(preEnd);
    fs.writeFileSync('src/components/PageBlocks.tsx', code);
    console.log("PreRegistrationFormBlock replaced.");
} else {
    console.log("Could not find PreRegistrationFormBlock");
}

