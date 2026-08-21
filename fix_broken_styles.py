with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

code = code.replace("{key: 'style', label: 'Stil (solid/outline vs)', type: 'url'}", "{key: 'style', label: 'Stil (solid/outline vs)', type: 'text'}")
code = code.replace("{key: 'style', label: 'Stil (primary/outline)', type: 'url'}", "{key: 'style', label: 'Stil (primary/outline)', type: 'text'}")
code = code.replace("{key: 'bgColor', label: 'Arka Plan Rengi', type: 'url'}", "{key: 'bgColor', label: 'Arka Plan Rengi', type: 'color'}")
code = code.replace("{key: 'textColor', label: 'Metin Rengi', type: 'url'}", "{key: 'textColor', label: 'Metin Rengi', type: 'color'}")
code = code.replace("{key: 'icon', label: 'İkon', type: 'url'}", "{key: 'icon', label: 'İkon', type: 'icon'}")
code = code.replace("{key: 'badge', label: 'Rozet (Opsiyonel)', type: 'url'}", "{key: 'badge', label: 'Rozet (Opsiyonel)', type: 'text'}")
code = code.replace("{key: 'statValue', label: 'Ana İstatistik', type: 'url'}", "{key: 'statValue', label: 'Ana İstatistik', type: 'text'}")
code = code.replace("{key: 'statLabel', label: 'Ana İstatistik Etiketi', type: 'url'}", "{key: 'statLabel', label: 'Ana İstatistik Etiketi', type: 'text'}")
code = code.replace("{key: 'buttonText', label: 'Buton Metni', type: 'url'}", "{key: 'buttonText', label: 'Buton Metni', type: 'text'}")
code = code.replace("{key: 'style', label: 'Stil Tipi (light, primary, list)', type: 'url'}", "{key: 'style', label: 'Stil Tipi (light, primary, list)', type: 'text'}")


with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)
print("Fixed broken styles")
