with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

target = """            {renderArrayEditor('items', [
              { key: 'title', label: 'Kart Başlığı', type: 'text' },
              { key: 'subtitle', label: 'Kart Açıklaması', type: 'textarea' },
              { key: 'image', label: 'Görsel', type: 'image' },
              { key: 'colSpan', label: 'Tailwind Sütun Sınıfı (örn: col-span-12 md:col-span-6 lg:col-span-4)', type: 'text' },
              { key: 'url', label: 'Yönlendirme Linki (Opsiyonel)', type: 'text' }
            ], 'Bento Kartları')}"""

new_target = """            {renderArrayEditor('items', [
              { key: 'title', label: 'Kart Başlığı', type: 'text' },
              { key: 'subtitle', label: 'Kart Açıklaması', type: 'textarea' },
              { key: 'image', label: 'Görsel', type: 'image' },
              { key: 'colSpan', label: 'Tailwind Sütun Sınıfı (örn: col-span-12 md:col-span-6 lg:col-span-4)', type: 'text' },
              { key: 'url', label: 'Yönlendirme Linki (Opsiyonel)', type: 'url' }
            ], 'Bento Kartları')}"""

if target in code:
    code = code.replace(target, new_target)
    with open('src/admin/BlockFormEditor.tsx', 'w') as f:
        f.write(code)
    print("Patched successfully")
else:
    print("Target not found")
