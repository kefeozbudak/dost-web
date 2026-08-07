const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const additionalInput = `
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">
                            Kart Arka Plan Görseli
                          </label>
                          <input
                            type="text"
                            value={item.cardBgImage || ""}
                            onChange={(e) =>
                              handleArrayChange(
                                arrayKey,
                                idx,
                                "cardBgImage",
                                e.target.value,
                              )
                            }
                            placeholder="Görsel URL'si"
                            className="w-full text-xs border-slate-300 rounded p-1.5"
                          />
`;

code = code.replace(/className="w-full text-xs border-slate-300 rounded p-1\.5"\s*\/>\s*<\/div>\s*<\/div>/, 'className="w-full text-xs border-slate-300 rounded p-1.5"\n                            />\n                          </div>' + additionalInput);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
