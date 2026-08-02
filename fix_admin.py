import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

achievements_editors = """
        {block.type === 'achievements_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık Bölüm 1', 'titlePart1')}
            {renderInputWithStyle('Başlık Bölüm 2 (Renkli)', 'titlePart2')}
            {renderInputWithStyle('Başlık Bölüm 2 Rengi', 'titlePart2Color')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Arkaplan Görseli', 'image')}
            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link (URL)', type: 'url'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'bgColor', label: 'Arkaplan Rengi', type: 'color'},
              {key: 'textColor', label: 'Yazı Rengi', type: 'color'}
            ], "Butonlar")}
          </div>
        )}

        {block.type === 'achievements_academic_bento' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'style', label: 'Stil (primary/list/stat/default)', type: 'text'},
              {key: 'statValue', label: 'İstatistik Değeri', type: 'text'},
              {key: 'statLabel', label: 'İstatistik Etiketi', type: 'text'},
              {key: 'badge', label: 'Rozet (Badge)', type: 'text'},
              {key: 'buttonText', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Buton URL', type: 'url'}
            ], "Öğeler")}
          </div>
        )}

        {block.type === 'achievements_social_gallery' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'hoverText', label: 'Hover Metni', type: 'text'}
            ], "Galeri Öğeleri")}
          </div>
        )}

        {block.type === 'achievements_science_projects' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Görsel', 'image')}
            {renderInputWithStyle('Görsel Üzeri Etiket', 'imageBadge')}
            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'icon', label: 'İkon', type: 'icon'}
            ], "Projeler")}
          </div>
        )}
"""

target_marker = "      </div>\n      <MediaPickerModal"
if target_marker in code:
    new_code = code.replace(target_marker, achievements_editors + "\n" + target_marker)
    with open('src/admin/BlockFormEditor.tsx', 'w') as f:
        f.write(new_code)
    print("Added achievement editors")
else:
    print("Could not find target marker")
