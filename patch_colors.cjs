const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const oldGrid = `<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Zemin Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.bgColor || "#faf8ff"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), bgColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Kenarlık Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.borderColor || "#e2e8f0"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), borderColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">İkon Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.iconColor || "#006a62"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), iconColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Başlık Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.titleColor || "#1a1b23"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), titleColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>`;

const newGrid = `<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Zemin Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.bgColor || "#faf8ff"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), bgColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Kenarlık Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.borderColor || "#e2e8f0"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), borderColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">İkon Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.iconColor || "#006a62"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), iconColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Başlık Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.titleColor || "#1a1b23"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), titleColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Alt Başlık Rengi</label>
                      <input 
                        type="color" 
                        value={block.overlayCard?.subtitleColor || "#64748b"} 
                        onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), subtitleColor: e.target.value })} 
                        className="w-full h-8 cursor-pointer rounded-lg border border-slate-200"
                      />
                    </div>
                  </div>`;

content = content.replace(oldGrid, newGrid);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Patched Grid");
