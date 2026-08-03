const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const target = `<div key={i} data-editor-item-index={i} className="p-6 md:p-8 rounded-[2rem] bg-white/10 border border-white/10 hover:bg-white/[0.15] hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col text-left backdrop-blur-md"
                    >`;
                    
const replacement = `<div key={i} data-editor-item-index={i} className={\`p-6 md:p-8 rounded-[2rem] bg-white/10 border border-white/10 \${item.hoverEffect ? 'hover:-translate-y-1 hover:shadow-2xl' : ''} hover:bg-white/[0.15] hover:border-white/20 transition-all duration-300 flex flex-col text-left backdrop-blur-md\`}
                      style={{
                          backgroundColor: item.cardBgColor || undefined,
                          borderColor: item.cardBorderColor || undefined,
                          borderWidth: item.cardBorderWidth || undefined,
                          borderRadius: item.cardBorderRadius || undefined,
                          padding: item.cardPadding || undefined,
                          boxShadow: item.cardShadow === 'none' ? 'none' : (item.cardShadow ? \`var(--tw-shadow-\${item.cardShadow})\` : undefined),
                      }}
                    >`;

content = content.replace(target, replacement);

const targetTitle = `<h3
                        style={getItemTitleStyle(block)}
                        className="text-xl md:text-2xl font-bold mb-3 text-white"
                      >
                        {item.title}
                      </h3>`;

const replacementTitle = `<h3
                        style={{...getItemTitleStyle(block), color: item.itemTitleColor || getItemTitleStyle(block)?.color}}
                        className="text-xl md:text-2xl font-bold mb-3 text-white"
                      >
                        {item.title}
                      </h3>`;

content = content.replace(targetTitle, replacementTitle);

const targetDesc = `<p
                        style={getItemDescStyle(block)}
                        className="text-white/80 text-sm leading-relaxed mb-8 flex-1"
                      >
                        {item.desc}
                      </p>`;

const replacementDesc = `<p
                        style={{...getItemDescStyle(block), color: item.itemDescColor || getItemDescStyle(block)?.color}}
                        className="text-white/80 text-sm leading-relaxed mb-8 flex-1"
                      >
                        {item.desc}
                      </p>`;

content = content.replace(targetDesc, replacementDesc);

const targetButton = `<a
                          href={item.buttonUrl || "#"}
                          className="w-full py-3.5 px-4 rounded-xl bg-[#5eead4] text-[#0f172a] font-bold text-sm text-center hover:opacity-90 hover:shadow-lg transition-all duration-300 block"
                          style={getItemButtonStyle(block)}
                        >
                          {item.buttonText || "Detaylı Bilgi"}
                        </a>`;

const replacementButton = `<a
                          href={item.buttonUrl || "#"}
                          className="w-full py-3.5 px-4 rounded-xl bg-[#5eead4] text-[#0f172a] font-bold text-sm text-center hover:opacity-90 hover:shadow-lg transition-all duration-300 block"
                          style={{
                              ...getItemButtonStyle(block),
                              backgroundColor: item.buttonBgColor || getItemButtonStyle(block)?.backgroundColor,
                              color: item.buttonTextColor || getItemButtonStyle(block)?.color
                          }}
                        >
                          {item.buttonText || "Detaylı Bilgi"}
                        </a>`;
content = content.replace(targetButton, replacementButton);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched item styles in PageBlocks.tsx");
