import fs from 'fs';

// 1. BlockFormEditor.tsx
let editor = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');
const editorBento = `
        {block.type === "bento_academic" && (
          <div className="space-y-4">
            {renderTextareaWithStyle("Başlık", "title")}
            {renderArrayEditor(
              "items",
              [
                { key: "title", label: "Başlık", type: "text" },
                { key: "desc", label: "Açıklama", type: "textarea" },
                { key: "icon", label: "İkon", type: "icon" },
                { key: "stat", label: "İstatistik (Kart 1)", type: "text" },
                { key: "statLabel", label: "İstatistik Etiketi (Kart 1)", type: "text" },
                { key: "tag", label: "Rozet/Etiket (Kart 1)", type: "text" },
                { key: "buttonText", label: "Buton Metni (Kart 2)", type: "text" },
                { key: "url", label: "Buton URL (Kart 2)", type: "url" },
                { key: "stat1Label", label: "İstatistik 1 Etiketi (Kart 2)", type: "text" },
                { key: "stat1Value", label: "İstatistik 1 Değeri (Kart 2)", type: "text" },
                { key: "stat2Label", label: "İstatistik 2 Etiketi (Kart 2)", type: "text" },
                { key: "stat2Value", label: "İstatistik 2 Değeri (Kart 2)", type: "text" },
                { key: "listString", label: "Özellik Listesi (Kart 3 - Her satıra bir tane)", type: "textarea" }
              ],
              "Öğeler (Max 3, Özel Tasarım)",
            )}
          </div>
        )}
`;

editor = editor.replace('default:', editorBento + '\n      default:');
fs.writeFileSync('src/admin/BlockFormEditor.tsx', editor);

// 2. PageBlocks.tsx
let pb = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');
const pbBento = `
        case "bento_academic":
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
                    {block.title}
                  </h2>
                  <div
                    className="w-24 h-1 bg-gold mx-auto rounded-full whitespace-pre-line"
                    style={{ backgroundColor: "#D4AF37" }}
                  ></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 whitespace-pre-line">
                  {/* LGS Card */}
                  {block.items && block.items[0] && (
                    <div className="bg-surface-card border border-border-subtle rounded-3xl p-8 bento-card relative overflow-hidden transition-all duration-700 hover:-translate-y-2 whitespace-pre-line">
                      <div
                        className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full -mr-16 -mt-16 whitespace-pre-line"
                        style={{ backgroundColor: "rgba(212, 175, 55, 0.05)" }}
                      ></div>
                      <IconPreview
                        data={block.items[0].icon || "school"}
                        className="text-primary text-4xl mb-6 whitespace-pre-line"
                       style={getIconStyle(null, block)} />
                      <h3 className="font-headline-md text-headline-md mb-2 whitespace-pre-line">
                        {block.items[0].title}
                      </h3>
                      <p className="text-on-surface-variant mb-8 whitespace-pre-line">
                        {block.items[0].desc}
                      </p>
                      <div className="space-y-6 whitespace-pre-line">
                        <div className="flex items-end gap-3 whitespace-pre-line">
                          <span
                            className="text-4xl font-extrabold text-gold whitespace-pre-line"
                            style={{ color: "#D4AF37" }}
                          >
                            {block.items[0].stat}
                          </span>
                          <span className="text-label-md text-on-surface-variant pb-1 whitespace-pre-line">
                            {block.items[0].statLabel}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden whitespace-pre-line">
                          <div
                            className="h-full bg-gold w-[98%] whitespace-pre-line"
                            style={{ backgroundColor: "#D4AF37" }}
                          ></div>
                        </div>
                        <p className="text-label-sm font-label-sm text-primary uppercase whitespace-pre-line">
                          {block.items[0].tag}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* YKS Card */}
                  {block.items && block.items[1] && (
                    <div className="bg-primary text-on-primary rounded-3xl p-8 bento-card relative overflow-hidden transition-all duration-700 hover:-translate-y-2 whitespace-pre-line">
                      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full -mb-24 -mr-24 rotate-45 whitespace-pre-line"></div>
                      <IconPreview
                        data={block.items[1].icon || "star"}
                        className="text-gold text-4xl mb-6 whitespace-pre-line"
                        style={{ ...getIconStyle(null, block), fontVariationSettings: "'FILL' 1",
                          color: "#D4AF37",
                        }}
                      />
                      <h3 className="font-headline-md text-headline-md mb-2 text-white whitespace-pre-line">
                        {block.items[1].title}
                      </h3>
                      <p className="text-primary-fixed mb-8 whitespace-pre-line">
                        {block.items[1].desc}
                      </p>
                      <div className="grid grid-cols-2 gap-6 items-center whitespace-pre-line">
                        {(() => {
                          const stats = block.items[1].stats || [];
                          if (block.items[1].stat1Label && block.items[1].stat1Value && stats.length === 0) {
                            stats.push({ label: block.items[1].stat1Label, value: block.items[1].stat1Value });
                          }
                          if (block.items[1].stat2Label && block.items[1].stat2Value && stats.length === 0) {
                            stats.push({ label: block.items[1].stat2Label, value: block.items[1].stat2Value });
                          }
                          return stats.map((stat: any, i: number) => (
                            <div
                              key={i}
                              className="bg-white/10 p-4 rounded-2xl whitespace-pre-line"
                            >
                              <div
                                className="text-2xl font-bold text-gold whitespace-pre-line"
                                style={{ color: "#D4AF37" }}
                              >
                                {stat.value}
                              </div>
                              <div className="text-[10px] opacity-80 uppercase tracking-wider whitespace-pre-line">
                                {stat.label}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                      {block.items[1].buttonText && (
                        <a
                          href={block.items[1].url || "#"}
                          className={\`mt-8 block \${block.styles?.textAlign ? "" : "text-center"} w-full py-3 bg-gold text-[#00164f] font-bold rounded-xl hover:opacity-90 transition-opacity\`}
                          style={{ backgroundColor: "#D4AF37" }}
                        >
                          {block.items[1].buttonText}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Rankings Card */}
                  {block.items && block.items[2] && (
                    <div className="bg-surface-card border border-border-subtle rounded-3xl p-8 bento-card flex flex-col justify-between transition-all duration-700 hover:-translate-y-2 whitespace-pre-line">
                      <div className="w-full md:w-auto flex-1">
                        <IconPreview
                          data={block.items[2].icon || "analytics"}
                          className="text-primary text-4xl mb-6 whitespace-pre-line"
                         style={getIconStyle(null, block)} />
                        <h3 className="font-headline-md text-headline-md mb-2 whitespace-pre-line">
                          {block.items[2].title}
                        </h3>
                        <p className="text-on-surface-variant mb-6 whitespace-pre-line">
                          {block.items[2].desc}
                        </p>
                      </div>
                      <ul className="space-y-4 whitespace-pre-line">
                        {(() => {
                          let list = block.items[2].list || [];
                          if (list.length === 0 && block.items[2].listString) {
                            list = block.items[2].listString.split('\\n').filter((x: string) => x.trim());
                          }
                          return list.map(
                            (listItem: string, i: number) => (
                              <li
                                key={i}
                                className="flex items-center gap-3 whitespace-pre-line"
                              >
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 whitespace-pre-line"
                                  style={{
                                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                                  }}
                                >
                                  <span
                                    className="material-symbols-outlined text-gold text-lg whitespace-pre-line"
                                    translate="no"
                                    aria-hidden="true"
                                    style={{ color: "#D4AF37" }}
                                  >
                                    check_circle
                                  </span>
                                </div>
                                <span className="font-body-md text-body-md whitespace-pre-line">
                                  {listItem}
                                </span>
                              </li>
                            )
                          );
                        })()}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
`;

pb = pb.replace('default:', pbBento + '\n      default:');
fs.writeFileSync('src/components/PageBlocks.tsx', pb);
