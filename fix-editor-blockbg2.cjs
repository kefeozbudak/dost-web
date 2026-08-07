const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const additionalBlockInput = `
                </div>
                
                <label className="text-[10px] font-bold text-slate-400 block mb-1 mt-3">
                  Kart Arka Plan Görseli
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={block.styles?.cardBgImage || ""}
                    onChange={(e) =>
                      handleStyleChange("cardBgImage", e.target.value)
                    }
                    placeholder="Görsel URL'si (http... veya /img.jpg)"
                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none font-mono"
                  />
`;

code = code.replace(/className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono"\n                    placeholder="Varsayılan"\n                  \/>\n                <\/div>/, 'className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono"\n                    placeholder="Varsayılan"\n                  />\n                </div>' + additionalBlockInput + '                </div>');

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
