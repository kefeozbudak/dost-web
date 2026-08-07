import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    c = f.read()

styles_block = '''
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 mt-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block border-b border-slate-200 pb-2">Form Görünüm & CSS Renk Ayarları</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Arka Plan Rengi</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={block.styles?.backgroundColor || '#faf8ff'} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                    <input type="text" value={block.styles?.backgroundColor || ''} onChange={(e) => handleStyleChange('backgroundColor', e.target.value)} placeholder="#faf8ff" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Başlık Yazı Rengi</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={block.styles?.titlePart1Color || '#002147'} onChange={(e) => handleStyleChange('titlePart1Color', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                    <input type="text" value={block.styles?.titlePart1Color || ''} onChange={(e) => handleStyleChange('titlePart1Color', e.target.value)} placeholder="#002147" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Alt Başlık Yazı Rengi</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={block.styles?.color || '#333333'} onChange={(e) => handleStyleChange('color', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer shrink-0" />
                    <input type="text" value={block.styles?.color || ''} onChange={(e) => handleStyleChange('color', e.target.value)} placeholder="#333333" className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none" />
                  </div>
                </div>
              </div>
            </div>
'''

c = re.sub(
    r'<div className="border-t border-slate-200 pt-4 mt-4">\s*<h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">Tablo ve Sonuç Metinleri</h4>',
    styles_block + '\n            <div className="border-t border-slate-200 pt-4 mt-4">\n               <h4 className="font-bold text-slate-700 mb-2 text-sm uppercase">Tablo ve Sonuç Metinleri</h4>',
    c, count=1
)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(c)

