import re

with open("src/admin/hubs/AppearanceCenter.tsx", "r") as f:
    content = f.read()

target_logo = r"""                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logo Yükle</label>
                    <div className="flex flex-wrap items-center gap-4">"""

replacement_logo = r"""                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logo Yükle</label>
                    <div className="flex flex-wrap items-center gap-4 mb-4">"""
content = content.replace(target_logo, replacement_logo)

target_logo_input = r"""                        <input type="file" accept="image/\*" onChange=\{\(e\) => e\.target\.files\?\.\[0\] && handleImageUpload\(e\.target\.files\[0\], true\)\} className="text-xs" />
                      </div>
                    </div>
                  </div>"""

replacement_logo_input = r"""                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], true)} className="text-xs" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Logo Boyutu (Yükseklik: {headerData.logoHeight || 48}px)</label>
                      <input 
                        type="range" min="20" max="120" 
                        value={headerData.logoHeight || 48} 
                        onChange={(e) => setHeaderData({...headerData, logoHeight: parseInt(e.target.value)})} 
                        className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer" 
                      />
                    </div>
                  </div>"""
content = re.sub(target_logo_input, replacement_logo_input, content)

target_button = r"""                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aksiyon Butonu Metni</label>"""

replacement_button = r"""                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-slate-50 p-2 rounded border border-slate-200">
                      <input 
                        type="checkbox" 
                        id="ctaHidden" 
                        checked={headerData.ctaButton?.hidden || false} 
                        onChange={(e) => setHeaderData({...headerData, ctaButton: {...headerData.ctaButton, hidden: e.target.checked}})} 
                        className="rounded text-blue-600 w-4 h-4 cursor-pointer" 
                      />
                      <label htmlFor="ctaHidden" className="text-sm font-bold text-slate-700 cursor-pointer select-none flex-1">Aksiyon Butonunu Gizle</label>
                    </div>
                    <div className={headerData.ctaButton?.hidden ? 'opacity-50 pointer-events-none' : ''}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aksiyon Butonu Metni</label>"""

content = re.sub(target_button, replacement_button, content)

target_button_url = r"""                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aksiyon Butonu Linki</label>
                      \{renderUrlEditor\(headerData\.ctaButton\?\.url \|\| "", \(val\) => setHeaderData\(\{\.\.\.headerData, ctaButton: \{\.\.\.headerData\.ctaButton, url: val\}\}\)\)\}
                    </div>
                  </div>"""

replacement_button_url = r"""                    </div>
                    <div className={headerData.ctaButton?.hidden ? 'opacity-50 pointer-events-none' : ''}>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Aksiyon Butonu Linki</label>
                      {renderUrlEditor(headerData.ctaButton?.url || "", (val) => setHeaderData({...headerData, ctaButton: {...headerData.ctaButton, url: val}}))}
                    </div>
                  </div>"""
content = re.sub(target_button_url, replacement_button_url, content)

with open("src/admin/hubs/AppearanceCenter.tsx", "w") as f:
    f.write(content)
