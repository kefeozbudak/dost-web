import re

with open("src/admin/hubs/AppearanceCenter.tsx", "r") as f:
    content = f.read()

# 1. ctaHidden toggle
target_cta = r'<div className="flex gap-4">'
replacement_cta = r"""<div className="flex items-center gap-4 mb-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-slate-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={!headerData.ctaButton?.hidden} 
                          onChange={(e) => setHeaderData({...headerData, ctaButton: {...headerData.ctaButton, hidden: !e.target.checked}})}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        />
                        Ön Kayıt Formu Butonunu Göster
                      </label>
                    </div>
                    <div className="flex gap-4">"""
content = content.replace(target_cta, replacement_cta)

# 2. Add Hover Color setting
target_logo = r'<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">'
replacement_hover = r"""<div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
                <div className="mb-6 border-b pb-4">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><LayoutTemplate className="w-5 h-5 text-slate-400" /> Genel Görünüm</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Menü Hover Rengi</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="color" 
                        value={headerData.hoverColor || '#f97316'} 
                        onChange={(e) => setHeaderData({...headerData, hoverColor: e.target.value})} 
                        className="w-10 h-10 p-1 border rounded cursor-pointer"
                      />
                      <span className="text-sm text-slate-600">Fare ile menülerin üzerine gelindiğinde görünecek renk. (Varsayılan: Turuncu)</span>
                    </div>
                  </div>
                </div>"""
content = content.replace(target_logo, replacement_hover, 1)

# 3. Add dropdown type
target_select = r"""<option value="normal">Normal Menü</option>
                          <option value="mega">Mega Menü</option>"""
replace_select = r"""<option value="normal">Normal Menü</option>
                          <option value="dropdown">Açılır Menü (Dropdown)</option>
                          <option value="mega">Mega Menü</option>"""
content = content.replace(target_select, replace_select)

# 4. Add dropdown edit UI
target_mega_cond = r"\{link\.type === 'mega' && \("
replace_dropdown_and_mega = r"""{link.type === 'dropdown' && (
                        <div className="pl-4 border-l-2 border-blue-200 space-y-3 mt-4">
                           <div className="flex justify-between items-center mb-2">
                             <h4 className="text-sm font-bold text-slate-700">Alt Menüler</h4>
                             <button onClick={() => {
                               const newLinks = [...(headerData.links || [])];
                               if (!newLinks[index].subLinks) newLinks[index].subLinks = [];
                               newLinks[index].subLinks.push({ label: 'Yeni Link', url: '#' });
                               setHeaderData({ ...headerData, links: newLinks });
                             }} className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded hover:bg-blue-100">Link Ekle</button>
                           </div>
                           <div className="space-y-2">
                             {(link.subLinks || []).map((sublink: any, subIdx: number) => (
                               <div key={subIdx} className="flex gap-2 bg-white p-2 border border-slate-200 rounded">
                                 <input type="text" value={sublink.label || ''} onChange={(e) => {
                                    const newLinks = [...(headerData.links || [])];
                                    newLinks[index].subLinks[subIdx].label = e.target.value;
                                    setHeaderData({ ...headerData, links: newLinks });
                                 }} placeholder="Link Adı" className="w-1/3 px-2 py-1 text-xs border rounded" />
                                 <div className="flex-1">
                                   {renderUrlEditor(sublink.url || '', (val) => {
                                      const newLinks = [...(headerData.links || [])];
                                      newLinks[index].subLinks[subIdx].url = val;
                                      setHeaderData({ ...headerData, links: newLinks });
                                   })}
                                 </div>
                                 <button onClick={() => {
                                    const newLinks = [...(headerData.links || [])];
                                    newLinks[index].subLinks.splice(subIdx, 1);
                                    setHeaderData({ ...headerData, links: newLinks });
                                 }} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                   <Trash2 className="w-4 h-4" />
                                 </button>
                               </div>
                             ))}
                           </div>
                        </div>
                      )}
                      
                      {link.type === 'mega' && ("""
content = re.sub(target_mega_cond, replace_dropdown_and_mega, content, count=1)

with open("src/admin/hubs/AppearanceCenter.tsx", "w") as f:
    f.write(content)

