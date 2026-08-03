const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const target1 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Kart Zemin Rengi</label>
                      <input type="text" value={item.cardBgColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBgColor', e.target.value)} placeholder="örn: #ffffff" className="w-full text-xs border-slate-300 rounded p-1.5" />
                    </div>`;
const replacement1 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Kart Zemin Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.cardBgColor === 'currentColor' || !item.cardBgColor ? '#ffffff' : item.cardBgColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBgColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.cardBgColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBgColor', e.target.value)} placeholder="Şeffaf" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>`;
content = content.replace(target1, replacement1);

const target2 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Kenarlık Rengi & Kalınlığı</label>
                      <div className="flex gap-1">
                        <input type="text" value={item.cardBorderColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderColor', e.target.value)} placeholder="Renk (örn: #e2e8f0)" className="w-2/3 text-xs border-slate-300 rounded p-1.5" />
                        <input type="text" value={item.cardBorderWidth || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderWidth', e.target.value)} placeholder="Kalınlık (1px)" className="w-1/3 text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>`;
const replacement2 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Kenarlık Rengi & Kalınlığı</label>
                      <div className="flex gap-1 items-center">
                        <input type="color" value={item.cardBorderColor === 'currentColor' || !item.cardBorderColor ? '#e2e8f0' : item.cardBorderColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.cardBorderColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderColor', e.target.value)} placeholder="Renk" className="w-1/2 text-xs border-slate-300 rounded p-1.5" />
                        <input type="text" value={item.cardBorderWidth || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderWidth', e.target.value)} placeholder="1px" className="w-1/3 text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>`;
content = content.replace(target2, replacement2);

const target3 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Köşe Yuvarlama (Radius)</label>
                      <input type="text" value={item.cardBorderRadius || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderRadius', e.target.value)} placeholder="örn: 12px veya 1.5rem" className="w-full text-xs border-slate-300 rounded p-1.5" />
                    </div>`;
const replacement3 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Köşe Yuvarlama (Radius)</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min="0" max="64" value={parseInt(item.cardBorderRadius) || 0} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderRadius', e.target.value + 'px')} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                        <input type="text" value={item.cardBorderRadius || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardBorderRadius', e.target.value)} placeholder="12px" className="w-16 text-xs border-slate-300 rounded p-1.5 text-center" />
                      </div>
                    </div>`;
content = content.replace(target3, replacement3);

const target4 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">İç Boşluk (Padding)</label>
                      <input type="text" value={item.cardPadding || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardPadding', e.target.value)} placeholder="örn: 24px" className="w-full text-xs border-slate-300 rounded p-1.5" />
                    </div>`;
const replacement4 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">İç Boşluk (Padding)</label>
                      <div className="flex items-center gap-2">
                        <input type="range" min="0" max="64" value={parseInt(item.cardPadding) || 0} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardPadding', e.target.value + 'px')} className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                        <input type="text" value={item.cardPadding || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'cardPadding', e.target.value)} placeholder="24px" className="w-16 text-xs border-slate-300 rounded p-1.5 text-center" />
                      </div>
                    </div>`;
content = content.replace(target4, replacement4);

const target5 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Başlık Rengi</label>
                      <input type="text" value={item.itemTitleColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemTitleColor', e.target.value)} placeholder="örn: #1a1b23" className="w-full text-xs border-slate-300 rounded p-1.5" />
                    </div>`;
const replacement5 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Başlık Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.itemTitleColor === 'currentColor' || !item.itemTitleColor ? '#000000' : item.itemTitleColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemTitleColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.itemTitleColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemTitleColor', e.target.value)} placeholder="Varsayılan" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>`;
content = content.replace(target5, replacement5);

const target6 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Açıklama Rengi</label>
                      <input type="text" value={item.itemDescColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemDescColor', e.target.value)} placeholder="örn: #434654" className="w-full text-xs border-slate-300 rounded p-1.5" />
                    </div>`;
const replacement6 = `                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Açıklama Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.itemDescColor === 'currentColor' || !item.itemDescColor ? '#000000' : item.itemDescColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemDescColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.itemDescColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'itemDescColor', e.target.value)} placeholder="Varsayılan" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Buton Yazı Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.buttonTextColor === 'currentColor' || !item.buttonTextColor ? '#0f172a' : item.buttonTextColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'buttonTextColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.buttonTextColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'buttonTextColor', e.target.value)} placeholder="Varsayılan" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Buton Zemin Rengi</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={item.buttonBgColor === 'currentColor' || !item.buttonBgColor ? '#5eead4' : item.buttonBgColor} onChange={(e) => handleArrayChange(arrayKey, idx, 'buttonBgColor', e.target.value)} className="w-6 h-6 p-0 border-0 rounded cursor-pointer shrink-0" />
                        <input type="text" value={item.buttonBgColor || ''} onChange={(e) => handleArrayChange(arrayKey, idx, 'buttonBgColor', e.target.value)} placeholder="Varsayılan" className="w-full text-xs border-slate-300 rounded p-1.5" />
                      </div>
                    </div>`;
content = content.replace(target6, replacement6);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Patched advanced styles UI in BlockFormEditor.tsx");
