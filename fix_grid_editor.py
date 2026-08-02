with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

old_str = "{key: 'image', label: 'Görsel', type: 'image'},"
new_str = "{key: 'image', label: 'Görsel', type: 'image'},\n              {key: 'icon', label: 'İkon (Opsiyonel)', type: 'icon'},"

if old_str in code:
    code = code.replace(old_str, new_str)
    with open('src/admin/BlockFormEditor.tsx', 'w') as f:
        f.write(code)
    print("Added icon to items editor")
