with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

new_editors = """
        {block.type === 'news_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arkaplan Görseli', 'image')}
          </div>
        )}

        {block.type === 'news_grid' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={block.showPagination || false} onChange={e => handleChange('showPagination', e.target.checked)} id="showPagination" />
              <label htmlFor="showPagination" className="text-sm">Sayfalama (Pagination) Göster</label>
            </div>
            {renderArrayEditor('categories', [
              {key: 'label', label: 'Kategori Adı', type: 'text'}
            ], "Kategoriler")}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'date', label: 'Tarih', type: 'text'},
              {key: 'tag', label: 'Kategori Etiketi (Rozet)', type: 'text'},
              {key: 'tagColor', label: 'Etiket Rengi (Tailwind class)', type: 'text'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Buton URL', type: 'url'}
            ], "Haber / Duyuru Öğeleri")}
          </div>
        )}

        {block.type === 'newsletter' && (
          <div className="space-y-4">
            {renderInputWithStyle('İkon', 'icon')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'desc')}
            {renderInputWithStyle('Input Placeholder', 'inputPlaceholder')}
            {renderInputWithStyle('Buton Metni', 'buttonText')}
            {renderInputWithStyle('Alt Açıklama (Caption)', 'caption')}
          </div>
        )}
"""

target_marker = "      </div>\n      <MediaPickerModal"
if target_marker in code:
    new_code = code.replace(target_marker, new_editors + "\n" + target_marker)
    with open('src/admin/BlockFormEditor.tsx', 'w') as f:
        f.write(new_code)
    print("Added news editors")
else:
    print("Could not find target marker")
