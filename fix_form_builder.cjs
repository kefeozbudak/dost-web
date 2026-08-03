const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const startBuilder = code.indexOf("const DynamicFormBuilder =");
const endBuilder = code.indexOf("const PreRegistrationFormBlock =");

const newCode = `const DynamicFormBuilder = ({ block, type, submitForm }: any) => {
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
    <div className={type === "club_registration_form" ? "bg-surface-card border border-border-subtle rounded-xl p-6 md:p-10 shadow-sm relative form-card" : "relative"} style={type === "club_registration_form" && block.styles?.cardBgColor ? { backgroundColor: block.styles.cardBgColor } : {}}>
      {submitted ? (
        <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">check_circle</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Başvurunuz Alındı</h3>
          <p className="font-body-md text-body-md text-text-muted">Kayıt başvurunuz başarıyla alınmıştır.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {defaultInputs.length === 0 ? (
            <div className="p-6 text-center text-text-muted border border-dashed border-border-subtle rounded-lg">
              Lütfen yönetim panelinden form alanlarını (inputlar) ekleyiniz.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {defaultInputs.map((input: any, i: number) => {
                const colSpan = (input.type === 'section_title' || input.type === 'textarea' || input.type === 'checkbox' || input.type === 'radio') ? 'md:col-span-2' : '';
                
                if (input.type === 'section_title') {
                  return (
                    <div key={i} className={\`flex items-center gap-2 border-b border-border-subtle pb-3 mt-4 first:mt-0 \${colSpan}\`}>
                      {input.icon && <span className="material-symbols-outlined text-primary">{input.icon}</span>}
                      <h2 className="font-headline-md text-headline-md text-on-surface">{input.label}</h2>
                    </div>
                  );
                }

                if (input.type === 'checkbox') {
                  return (
                    <div key={i} className={\`pt-2 border-t border-border-subtle \${colSpan}\`}>
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative mt-1">
                          <input 
                            type="checkbox" required={input.required} 
                            checked={!!formData[input.name]} 
                            onChange={e => handleChange(input.name, e.target.checked)}
                            className="peer h-5 w-5 rounded border-border-subtle text-primary focus:ring-primary/20 transition-all cursor-pointer" 
                          />
                        </div>
                        <span className="font-body-md text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                          <span className="font-bold text-primary">{input.label.split(' ')[0]}</span> {input.label.substring(input.label.indexOf(' ') + 1)}
                        </span>
                      </label>
                    </div>
                  );
                }

                if (input.type === 'radio') {
                  const opts = (input.options || "").split(',').map((o: string) => o.trim());
                  return (
                    <div key={i} className={\`space-y-2 \${colSpan}\`}>
                      <label className="font-label-md text-label-md text-on-surface-variant block">{input.label}</label>
                      <div className="space-y-2">
                        {opts.map((opt: string, optIdx: number) => (
                          <label key={optIdx} className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="radio" name={input.name} value={opt} required={input.required}
                              checked={formData[input.name] === opt} 
                              onChange={e => handleChange(input.name, e.target.value)}
                              className="text-primary focus:ring-primary/20"
                            />
                            <span className="font-body-md text-body-md text-on-surface">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }
                
                if (input.type === 'textarea') {
                  return (
                    <div key={i} className={\`space-y-2 \${colSpan}\`}>
                      <label className="font-label-md text-label-md text-on-surface-variant block">{input.label}</label>
                      <textarea 
                        required={input.required} rows={4}
                        value={formData[input.name] || ''} onChange={e => handleChange(input.name, e.target.value)} 
                        className="w-full px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                        placeholder={input.placeholder || ""}
                      />
                    </div>
                  );
                }

                if (input.type === 'select') {
                  const opts = (input.options || "").split(',').map((o: string) => o.trim());
                  return (
                    <div key={i} className={\`space-y-2 \${colSpan}\`}>
                      <label className="font-label-md text-label-md text-on-surface-variant block">{input.label}</label>
                      <select 
                        required={input.required} 
                        value={formData[input.name] || ''} onChange={e => handleChange(input.name, e.target.value)} 
                        className="w-full px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat"
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
                    <label className="font-label-md text-label-md text-on-surface-variant block">{input.label}</label>
                    <input 
                      type={input.type || "text"} required={input.required} 
                      value={formData[input.name] || ''} onChange={e => handleChange(input.name, e.target.value)} 
                      className="w-full px-4 py-3 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                      placeholder={input.placeholder || ""} 
                    />
                  </div>
                );
              })}
              
              {type === 'club_registration_form' && block.clubs && block.clubs.length > 0 && (
                <div className="md:col-span-2 space-y-6 mt-0">
                  <div className="flex items-center gap-2 border-b border-border-subtle pb-3">
                    <span className="material-symbols-outlined text-primary">explore</span>
                    <h2 className="font-headline-md text-headline-md text-on-surface">Kulüp Seçimi</h2>
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
                          className="flex flex-col items-center justify-center p-4 border border-border-subtle rounded-xl cursor-pointer hover:bg-surface-container-low peer-checked:border-primary peer-checked:bg-primary/5 transition-all group h-full"
                        >
                          <span className={\`material-symbols-outlined text-3xl mb-2 transition-colors \${formData.club === clubOpt.label ? 'text-primary' : 'text-text-muted group-hover:text-primary'}\`}>
                            {clubOpt.icon || 'explore'}
                          </span>
                          <span className="font-label-md text-label-md text-on-surface text-center">{clubOpt.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-6">
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-4 bg-primary text-white font-bold text-label-md rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
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
          <h1 className="font-display-lg text-display-lg text-primary mb-2">{block.title || "Dost Koleji"}</h1>
          <p className="font-body-lg text-body-lg text-text-muted">{block.subtitle || "Öğrenci Kulüp Kayıt Portalı"}</p>
        </div>
        <DynamicFormBuilder block={block} type="club_registration_form" />
      </div>
    </section>
  );
};
`
code = code.substring(0, startBuilder) + newCode + code.substring(endBuilder);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
