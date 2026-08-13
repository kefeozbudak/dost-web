const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const oldHeroBlock = `            {renderArrayEditor(
              'buttons',
              [
                { key: 'label', label: 'Buton Metni', type: 'text' },
                { key: 'url', label: 'Link', type: 'url' },
                { key: 'primary', label: 'Birincil Stil (Mavi Arka Plan - İşaretlenmezse saydam olur)', type: 'checkbox' }
              ],
              'Butonlar'
            )}
          </div>`;

const newHeroBlock = `            {renderArrayEditor(
              'buttons',
              [
                { key: 'label', label: 'Buton Metni', type: 'text' },
                { key: 'url', label: 'Link', type: 'url' },
                { key: 'primary', label: 'Birincil Stil (Mavi Arka Plan - İşaretlenmezse saydam olur)', type: 'checkbox' }
              ],
              'Butonlar'
            )}
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4 mt-6">
              <h4 className="font-bold text-sm text-slate-700">Resim Üzeri Bilgi Kartı (Overlay Card)</h4>
              
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="overlayEnabled"
                  checked={block.overlayCard?.enabled ?? (block.type !== 'high_school_hero')}
                  onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), enabled: e.target.checked })}
                />
                <label htmlFor="overlayEnabled" className="text-sm font-bold text-slate-700 cursor-pointer">Bu kartı göster</label>
              </div>
              
              {(block.overlayCard?.enabled ?? (block.type !== 'high_school_hero')) && (
                <div className="space-y-4 pt-4 border-t border-slate-200">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">İkon (Material)</label>
                    <input 
                      type="text" 
                      value={block.overlayCard?.icon || ""} 
                      placeholder="extension"
                      onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), icon: e.target.value })} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Kart Başlığı</label>
                    <input 
                      type="text" 
                      value={block.overlayCard?.title || ""} 
                      placeholder="Oyun Temelli Eğitim"
                      onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), title: e.target.value })} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Kart Alt Başlığı</label>
                    <input 
                      type="text" 
                      value={block.overlayCard?.subtitle || ""} 
                      placeholder="Aktif Öğrenme Yaklaşımı"
                      onChange={(e) => handleChange("overlayCard", { ...(block.overlayCard || {}), subtitle: e.target.value })} 
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  </div>
                </div>
              )}
            </div>
          </div>`;

content = content.replace(oldHeroBlock, newHeroBlock);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Patched BlockFormEditor");
