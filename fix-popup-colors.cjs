const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8');

const titleColorHtml = `
                    <label className="block">
                      <span className="text-xs font-bold text-slate-500 uppercase">Başlık Rengi</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedPopup.style?.titleColor || '#0f172a'}
                          onChange={(e) => updateStyleField({ titleColor: e.target.value })}
                          className="w-8 h-8 rounded border-0 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedPopup.style?.titleColor || '#0f172a'}
                          onChange={(e) => updateStyleField({ titleColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const handler = (e) => updateStyleField({ titleColor: e.target.value });
                            handler({ target: { value: "transparent" } } as any);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                          title="Rengi Temizle (Şeffaf)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    </label>

                    <label className="block">
                      <span className="text-xs font-bold text-slate-500 uppercase">Açıklama Metni Rengi</span>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={selectedPopup.style?.descColor || '#334155'}
                          onChange={(e) => updateStyleField({ descColor: e.target.value })}
                          className="w-8 h-8 rounded border-0 cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={selectedPopup.style?.descColor || '#334155'}
                          onChange={(e) => updateStyleField({ descColor: e.target.value })}
                          className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const handler = (e) => updateStyleField({ descColor: e.target.value });
                            handler({ target: { value: "transparent" } } as any);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-md shrink-0 transition-colors"
                          title="Rengi Temizle (Şeffaf)"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                      </div>
                    </label>
`;

code = code.replace(/<label className="block">\s*<span className="text-xs font-bold text-slate-500 uppercase">Metin Rengi<\/span>/, titleColorHtml + '\n                    <label className="block">\n                      <span className="text-xs font-bold text-slate-500 uppercase">Metin Rengi (Genel)</span>');

fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', code);
console.log("Updated title color");
