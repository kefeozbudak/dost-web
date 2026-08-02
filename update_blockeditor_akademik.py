import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

new_editor_code = """
        {block.type === 'academic_hero' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Ana Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Karartma Rengi (örn: rgba(0,0,0,0.5))</label>
              <input 
                type="text" 
                value={block.styles?.overlayColor || ''} 
                onChange={(e) => handleStyleChange('overlayColor', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500" 
              />
            </div>
          </div>
        )}
        
        {block.type === 'akademik_kadro' && (
          <div className="space-y-4">
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
              {key: 'itemDescColor', label: 'Ünvan Metin Rengi', type: 'color'}
            ], "Kadro Öğeleri")}
          </div>
        )}
"""

# Find a good place to insert, e.g. before `{block.type === 'about_hero' && (`
code = code.replace("{block.type === 'about_hero' && (", new_editor_code + "\n        {block.type === 'about_hero' && (")

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)

print("Updated BlockFormEditor.tsx")
