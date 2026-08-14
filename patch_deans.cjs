const fs = require('fs');

const file = 'src/components/ManagementBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

const original = `              <div key={idx} className={getCardClass(item, "p-4 rounded-xl bg-white shadow hover:shadow-lg transition-shadow border border-slate-100 flex flex-col")} style={getCardStyle(item, block)}>
                {item.image ? (
                  <div 
                    className="aspect-[4/5] w-full bg-center bg-cover rounded-lg mb-4 shrink-0" 
                    style={{ backgroundImage: \`url(\${item.image})\` }}
                  />
                ) : (
                  <div className="aspect-[4/5] w-full bg-slate-100 rounded-lg mb-4 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300">person</span>
                  </div>
                )}
                <div className="space-y-1 flex-grow">
                  <p className="text-[11px] font-bold text-primary uppercase leading-tight line-clamp-2">{item.desc || "Bölüm"}</p>
                  <h5 className="text-md font-bold text-slate-900 leading-snug" style={getCardTitleStyle(item, block)}>{item.name}</h5>
                  <p className="text-xs text-slate-500" style={getCardDescStyle(item, block)}>{item.role}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50">
                  {item.hideButton !== true && (
                    <a href={item.url || "#"} className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1 cursor-pointer">
                        {item.buttonText || "Fakülte Sayfası"} <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>`;

const replacement = `              <div key={idx} className={getCardClass(item, "rounded-xl overflow-hidden bg-white shadow hover:shadow-lg transition-shadow border border-slate-100 flex flex-col")} style={getCardStyle(item, block)}>
                {item.image ? (
                  <div 
                    className="aspect-[4/5] w-full bg-center bg-cover shrink-0" 
                    style={{ backgroundImage: \`url(\${item.image})\` }}
                  />
                ) : (
                  <div className="aspect-[4/5] w-full bg-slate-100 shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300">person</span>
                  </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="space-y-1 flex-grow">
                    <p className="text-[11px] font-bold text-primary uppercase leading-tight line-clamp-2">{item.desc || "Bölüm"}</p>
                    <h5 className="text-md font-bold text-slate-900 leading-snug" style={getCardTitleStyle(item, block)}>{item.name}</h5>
                    <p className="text-xs text-slate-500" style={getCardDescStyle(item, block)}>{item.role}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-50">
                    {item.hideButton !== true && (
                      <a href={item.url || "#"} className="text-xs font-bold text-slate-600 hover:text-primary flex items-center gap-1 cursor-pointer">
                          {item.buttonText || "Fakülte Sayfası"} <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>`;

content = content.replace(original, replacement);
fs.writeFileSync(file, content);
console.log("Patched ManagementBlocks.tsx");
