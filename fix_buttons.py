import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# Replace the buttons array definition for hero block
# Actually let's just replace all occurrences of this array definition since it applies to buttons in general
new_buttons_def = """            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'primary', label: 'Birincil Buton', type: 'checkbox'},
              {key: 'bgColor', label: 'Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Yazı Rengi', type: 'color'}
            ], "Butonlar", false, 'buttons')}"""

code = re.sub(r"\{renderArrayEditor\('buttons', \[\s*\{key: 'label', label: 'Buton Metni', type: 'text'\},\s*\{key: 'url', label: 'Link URL', type: 'url'\},\s*\{key: 'primary', label: 'Birincil Buton Görünümü', type: 'checkbox'\}\s*\], \"Butonlar\", false, 'buttons'\)\}", new_buttons_def, code)

# Let's also check if there are other button array definitions
new_buttons_def2 = """            {renderArrayEditor('buttons', [
              {key: 'label', label: 'Buton Metni', type: 'text'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'bgColor', label: 'Arka Plan Rengi', type: 'color'},
              {key: 'textColor', label: 'Yazı Rengi', type: 'color'}
            ], "Butonlar", false, 'buttons')}"""

code = re.sub(r"\{renderArrayEditor\('buttons', \[\s*\{key: 'label', label: 'Buton Metni', type: 'text'\},\s*\{key: 'url', label: 'Link URL', type: 'url'\}\s*\], \"Butonlar\", false, 'buttons'\)\}", new_buttons_def2, code)

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)

print("Updated BlockFormEditor buttons definitions!")
