import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# Add global styles for akademik kadro first
new_akademik_colors = """
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kart Arka Plan Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.cardBgColor || '#1a212c'} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.cardBgColor || ''} onChange={(e) => handleStyleChange('cardBgColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kart Başlık Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.cardTitleColor || '#ffffff'} onChange={(e) => handleStyleChange('cardTitleColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.cardTitleColor || ''} onChange={(e) => handleStyleChange('cardTitleColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kart Metin/İkon Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.cardTextColor || '#9ca3af'} onChange={(e) => handleStyleChange('cardTextColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.cardTextColor || ''} onChange={(e) => handleStyleChange('cardTextColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vurgu/Aksiyon Rengi</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={block.styles?.cardAccentColor || '#1d4eca'} onChange={(e) => handleStyleChange('cardAccentColor', e.target.value)} className="w-8 h-8 p-0 border-0 rounded cursor-pointer" />
                  <input type="text" value={block.styles?.cardAccentColor || ''} onChange={(e) => handleStyleChange('cardAccentColor', e.target.value)} className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono" placeholder="Varsayılan" />
                </div>
              </div>
"""

# Replace into akademik_kadro grid
code = code.replace("Sidebar Pasif Metin Rengi</label>\n                <div className=\"flex items-center gap-2\">\n                  <input type=\"color\" value={block.styles?.sidebarTextColor || '#e5e7eb'} onChange={(e) => handleStyleChange('sidebarTextColor', e.target.value)} className=\"w-8 h-8 p-0 border-0 rounded cursor-pointer\" />\n                  <input type=\"text\" value={block.styles?.sidebarTextColor || ''} onChange={(e) => handleStyleChange('sidebarTextColor', e.target.value)} className=\"flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono\" placeholder=\"Varsayılan\" />\n                </div>\n              </div>\n            </div>", "Sidebar Pasif Metin Rengi</label>\n                <div className=\"flex items-center gap-2\">\n                  <input type=\"color\" value={block.styles?.sidebarTextColor || '#e5e7eb'} onChange={(e) => handleStyleChange('sidebarTextColor', e.target.value)} className=\"w-8 h-8 p-0 border-0 rounded cursor-pointer\" />\n                  <input type=\"text\" value={block.styles?.sidebarTextColor || ''} onChange={(e) => handleStyleChange('sidebarTextColor', e.target.value)} className=\"flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono\" placeholder=\"Varsayılan\" />\n                </div>\n              </div>\n" + new_akademik_colors + "            </div>")

management_forms = """
        {block.type === 'management_hero' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Ana Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Karartma Rengi</label>
              <input type="text" value={block.styles?.overlayColor || ''} onChange={(e) => handleStyleChange('overlayColor', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
        )}

        {block.type === 'management_rector' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderInputWithStyle('Bölüm İkonu (Material)', 'icon')}
            {renderImageUpload('Rektör Görseli', 'image')}
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Rektör Adı', 'name')}
            {renderInputWithStyle('Ünvan/Rol', 'role')}
            {renderTextareaWithStyle('Alıntı (Söz)', 'quote')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (primary/outline)', type: 'text'}
            ], "Aksiyon Butonları")}
          </div>
        )}

        {block.type === 'management_vice_rectors' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderInputWithStyle('Bölüm İkonu', 'icon')}
            {renderArrayEditor('items', [
              {key: 'name', label: 'Kişi Adı', type: 'text'},
              {key: 'role', label: 'Rol/Ünvan', type: 'text'},
              {key: 'badge', label: 'Sorumluluk (Badge)', type: 'text'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'url', label: 'Profil Linki', type: 'url'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}
            ], "Yöneticiler")}
          </div>
        )}

        {block.type === 'management_deans' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderInputWithStyle('Bölüm İkonu', 'icon')}
            {renderArrayEditor('items', [
              {key: 'name', label: 'Dekan Adı', type: 'text'},
              {key: 'role', label: 'Rol/Ünvan', type: 'text'},
              {key: 'badge', label: 'Fakülte (Badge)', type: 'text'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'url', label: 'Fakülte Linki', type: 'url'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'}
            ], "Dekanlar")}
          </div>
        )}
"""

code = code.replace("{block.type === 'about_hero' && (", management_forms + "\n        {block.type === 'about_hero' && (")

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)

print("Updated BlockFormEditor.tsx with new forms")
