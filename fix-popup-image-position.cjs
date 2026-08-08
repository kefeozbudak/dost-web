const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8');

const imagePosHtml = `
                    {!selectedPopup.onlyImage && selectedPopup.imageUrl && !selectedPopup.pageEmbed && (
                      <label className="block mt-4">
                        <span className="text-xs font-bold text-slate-500 uppercase">Görsel Konumu</span>
                        <select
                          value={selectedPopup.imagePosition || 'top'}
                          onChange={(e) => updateCurrentPopup({ imagePosition: e.target.value as any })}
                          className="mt-1 w-full border-slate-200 rounded-lg text-sm bg-slate-50 focus:ring-[#0606f9] focus:border-[#0606f9] px-3 py-2 border outline-none"
                        >
                          <option value="left">Sola Hizala</option>
                          <option value="right">Sağa Hizala</option>
                          <option value="top">Üste Hizala</option>
                          <option value="bottom">Alta Hizala</option>
                          <option value="bg">Arka Plan (Zemin) Olarak Ayarla</option>
                        </select>
                      </label>
                    )}
`;

code = code.replace(/\{!\selectedPopup\.onlyImage && !selectedPopup\.pageEmbed && \(/, imagePosHtml + '\n                    {!selectedPopup.onlyImage && !selectedPopup.pageEmbed && (');

fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', code);
console.log("Updated image position");
