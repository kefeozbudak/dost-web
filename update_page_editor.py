import re

with open('src/admin/PageEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

insert_idx = content.find("{ type: 'clubs_hero', label: 'Kulüp Hero' },")

if insert_idx != -1:
    content = content[:insert_idx] + "{ type: 'tuition_fees', label: 'Kayıt Ücretleri' },\n                          " + content[insert_idx:]
    with open('src/admin/PageEditor.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated PageEditor.tsx successfully")
else:
    print("Could not find clubs_hero block")
