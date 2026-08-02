import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# Add block schema rules for the 4 new blocks

new_rules = """
    case 'achievements_hero':
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            {renderField('badge', 'Badge (Rozet)', 'text')}
            {renderField('image', 'Görsel URL', 'image')}
            {renderField('titlePart1', 'Başlık Bölüm 1', 'text')}
            {renderField('titlePart2', 'Başlık Bölüm 2', 'text')}
            {renderField('titlePart2Color', 'Başlık Bölüm 2 Rengi', 'color')}
          </div>
          {renderField('subtitle', 'Alt Başlık / Açıklama', 'textarea')}
          {renderArrayField('buttons', 'Butonlar', [
            {key: 'label', label: 'Metin', type: 'text'},
            {key: 'url', label: 'URL', type: 'text'},
            {key: 'icon', label: 'İkon', type: 'icon'},
            {key: 'bgColor', label: 'Arka Plan Rengi', type: 'color'},
            {key: 'textColor', label: 'Metin Rengi', type: 'color'}
          ])}
        </>
      );
    case 'achievements_academic_bento':
      return (
        <>
          {renderField('title', 'Bölüm Başlığı', 'text')}
          {renderArrayField('items', 'Kartlar', [
            {key: 'title', label: 'Başlık', type: 'text'},
            {key: 'desc', label: 'Açıklama', type: 'textarea'},
            {key: 'icon', label: 'İkon', type: 'icon'},
            {key: 'style', label: 'Stil Tipi (light, primary, list)', type: 'text'},
            {key: 'badge', label: 'Rozet (Opsiyonel)', type: 'text'},
            {key: 'statValue', label: 'Ana İstatistik', type: 'text'},
            {key: 'statLabel', label: 'Ana İstatistik Etiketi', type: 'text'},
            {key: 'buttonText', label: 'Buton Metni', type: 'text'},
            {key: 'url', label: 'Buton URL', type: 'text'},
          ])}
        </>
      );
    case 'achievements_social_gallery':
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            {renderField('title', 'Başlık', 'text')}
            {renderField('subtitle', 'Alt Başlık', 'textarea')}
          </div>
          {renderArrayField('items', 'Galeri Kartları', [
            {key: 'title', label: 'Kart Başlığı', type: 'text'},
            {key: 'desc', label: 'Açıklama', type: 'text'},
            {key: 'hoverText', label: 'Vurgu/Hover Metni', type: 'textarea'},
            {key: 'image', label: 'Görsel', type: 'image'}
          ])}
        </>
      );
    case 'achievements_science_projects':
      return (
        <>
          <div className="grid grid-cols-2 gap-4">
            {renderField('badge', 'Bölüm Rozeti', 'text')}
            {renderField('title', 'Başlık', 'text')}
            {renderField('image', 'Görsel URL', 'image')}
            {renderField('imageBadge', 'Görsel Üzeri Rozet', 'text')}
          </div>
          {renderField('subtitle', 'Alt Başlık', 'textarea')}
          {renderArrayField('items', 'Öğeler', [
            {key: 'title', label: 'Başlık', type: 'text'},
            {key: 'desc', label: 'Açıklama', type: 'textarea'},
            {key: 'icon', label: 'İkon', type: 'icon'}
          ])}
        </>
      );
"""

code = code.replace("default:", new_rules + "\n    default:")

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)

print("Updated BlockFormEditor.tsx for basarilarimiz blocks")
