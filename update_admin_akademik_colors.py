import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# I will find the block.type === 'akademik_kadro' and inject new style fields
new_editor = """
        {block.type === 'akademik_kadro' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sidebar Arka Plan Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.sidebarBgColor || '#1a212c'} onChange={(e) => handleStyleChange('sidebarBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.sidebarBgColor || ''} onChange={(e) => handleStyleChange('sidebarBgColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sidebar Aktif Öğe Arka Planı</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.sidebarActiveBgColor || '#1d4eca'} onChange={(e) => handleStyleChange('sidebarActiveBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.sidebarActiveBgColor || ''} onChange={(e) => handleStyleChange('sidebarActiveBgColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sidebar Aktif Metin Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.sidebarActiveTextColor || '#1d4eca'} onChange={(e) => handleStyleChange('sidebarActiveTextColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.sidebarActiveTextColor || ''} onChange={(e) => handleStyleChange('sidebarActiveTextColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Sidebar Pasif Metin Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.sidebarTextColor || '#e5e7eb'} onChange={(e) => handleStyleChange('sidebarTextColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.sidebarTextColor || ''} onChange={(e) => handleStyleChange('sidebarTextColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
            </div>
            
            {renderInputWithStyle('Sidebar Ana Başlık', 'sidebarTitle')}
            {renderInputWithStyle('Sidebar Alt Başlık', 'sidebarSubtitle')}
            
            {renderArrayEditor('sidebarItems', [
              {key: 'label', label: 'Menü Etiketi', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'icon', label: 'İkon (Material)', type: 'icon'}
            ], "Sidebar Menü Öğeleri")}

            {renderArrayEditor('items', [
              {key: 'title', label: 'Kişi Adı', type: 'text'},
              {key: 'subtitle', label: 'Ünvan/Bölüm', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'image', label: 'Profil Görseli', type: 'image'},
              {key: 'tag', label: 'Etiket (Örn: Bilgisayar Müh.)', type: 'text'},
              {key: 'tagColor', label: 'Etiket Rengi', type: 'color'},
              {key: 'url', label: 'Profil URL', type: 'url'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'},
              {key: 'cardBgColor', label: 'Kart Arka Plan Rengi', type: 'color'},
              {key: 'cardBorderColor', label: 'Kart Kenarlık Rengi', type: 'color'},
              {key: 'itemTitleColor', label: 'İsim Metin Rengi', type: 'color'},
              {key: 'itemDescColor', label: 'Ünvan Metin Rengi', type: 'color'},
              {key: 'itemTextColor', label: 'Açıklama Metin Rengi', type: 'color'},
              {key: 'buttonTextColor', label: 'Link Metin Rengi', type: 'color'}
            ], "Kadro Öğeleri")}
          </div>
        )}
"""

pattern = r"\{block\.type === 'akademik_kadro' && \([\s\S]*?\{renderArrayEditor\('items', \[\s*\{key: 'title'[\s\S]*?\]\, \"Kadro Öğeleri\"\)\}\s*<\/div>\s*\)\}"
code = re.sub(pattern, new_editor.strip(), code)

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)

print("Updated BlockFormEditor.tsx with new color fields")
