import fs from 'fs';

// 1. BlockFormEditor.tsx
let editor = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');
const editorHS = `
        {block.type === "high_school_programs" && (
          <div className="space-y-4">
            {renderTextareaWithStyle("Başlık", "title")}
            {renderTextareaWithStyle("Alt Başlık", "subtitle")}
            {renderArrayEditor(
              "items",
              [
                { key: "title", label: "Program Adı", type: "text" },
                { key: "desc", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon (Material)", type: "icon" },
                { key: "image", label: "Program Görseli", type: "image" },
                { key: "buttonText", label: "Buton Metni", type: "text" },
                { key: "url", label: "Buton URL", type: "url" },
                { key: "listString", label: "Özellikler (Her satıra bir tane)", type: "textarea" }
              ],
              "Lise Programları",
            )}
          </div>
        )}
`;

editor = editor.replace('default:', editorHS + '\n      default:');
fs.writeFileSync('src/admin/BlockFormEditor.tsx', editor);

// 2. PageBlocks.tsx
let pb = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');
const pbHS = `
        case "high_school_programs":
          return (
            <section
              key={index}
              className="py-section-gap bg-surface whitespace-pre-line"
              style={getStyle(block, "container")}
            >
              <div
                className={\`\${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop\`}
              >
                <div
                  className={\`\${block.styles?.textAlign ? "" : "text-center"} mb-16\`}
                >
                  <h2 className="font-headline-xl text-headline-xl text-on-surface mb-4 whitespace-pre-line">
                    {block.title || "Programlar"}
                  </h2>
                  {block.subtitle && (
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl mx-auto whitespace-pre-line">
                      {block.subtitle}
                    </p>
                  )}
                  <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full whitespace-pre-line"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 whitespace-pre-line">
                  {(block.items || []).map((item: any, i: number) => {
                    const isPrimary = i % 2 === 0;
                    return (
                      <div
                        key={i}
                        className={\`\${isPrimary ? "bg-primary text-on-primary" : "bg-surface-card border border-border-subtle"} rounded-3xl p-8 relative overflow-hidden transition-all duration-700 hover:-translate-y-2 flex flex-col whitespace-pre-line\`}
                      >
                        {isPrimary && (
                          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mb-32 -mr-32 whitespace-pre-line"></div>
                        )}
                        <div className="mb-6 whitespace-pre-line">
                          <IconPreview
                            data={item.icon || "school"}
                            className={\`\${isPrimary ? "text-gold" : "text-primary"} text-4xl whitespace-pre-line\`}
                            style={isPrimary ? { color: "#D4AF37" } : getIconStyle(null, block)}
                          />
                        </div>
                        <h3 className={\`font-headline-md text-headline-md mb-4 \${isPrimary ? "text-white" : "text-on-surface"} whitespace-pre-line\`}>
                          {item.title}
                        </h3>
                        <p className={\`\${isPrimary ? "text-primary-fixed" : "text-on-surface-variant"} mb-8 flex-grow whitespace-pre-line\`}>
                          {item.desc}
                        </p>
                        
                        {item.image && (
                          <div className="mb-8 rounded-2xl overflow-hidden aspect-video whitespace-pre-line">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover whitespace-pre-line" />
                          </div>
                        )}

                        <ul className="space-y-4 mb-8 whitespace-pre-line">
                          {(() => {
                            let list = item.list || [];
                            if (list.length === 0 && item.listString) {
                              list = item.listString.split('\\n').filter((x: string) => x.trim());
                            }
                            return list.map((listItem: string, j: number) => (
                              <li key={j} className="flex items-start gap-3 whitespace-pre-line">
                                <div className={\`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 \${isPrimary ? "bg-white/10" : "bg-primary/10"}\`}>
                                  <span className={\`material-symbols-outlined text-sm \${isPrimary ? "text-gold" : "text-primary"}\`} style={isPrimary ? { color: "#D4AF37" } : {}}>check</span>
                                </div>
                                <span className={\`font-body-md text-body-md \${isPrimary ? "text-white" : "text-on-surface-variant"} whitespace-pre-line\`}>
                                  {listItem}
                                </span>
                              </li>
                            ));
                          })()}
                        </ul>

                        {(item.buttonText || item.url) && (
                          <a
                            href={item.url || "#"}
                            className={\`inline-flex items-center gap-2 font-label-lg text-label-lg mt-auto \${isPrimary ? "text-gold hover:text-white" : "text-primary hover:text-primary-dark"} transition-colors whitespace-pre-line\`}
                            style={isPrimary ? { color: "#D4AF37" } : {}}
                          >
                            {item.buttonText || "Detaylı Bilgi"}
                            <span className="material-symbols-outlined text-lg" translate="no" aria-hidden="true">arrow_forward</span>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          );
`;

pb = pb.replace('default:', pbHS + '\n      default:');
fs.writeFileSync('src/components/PageBlocks.tsx', pb);
