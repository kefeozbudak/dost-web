import re

with open('src/admin/PageEditor.tsx', 'r') as f:
    code = f.read()

# Replace the block list
code = code.replace("{ type: 'about_hero', label: 'Hakkımızda Hero' },", "{ type: 'about_hero', label: 'Hakkımızda Hero' },\n                          { type: 'academic_hero', label: 'Akademik Hero' },\n                          { type: 'akademik_kadro', label: 'Akademik Kadro' },")

with open('src/admin/PageEditor.tsx', 'w') as f:
    f.write(code)

print("Updated PageEditor.tsx block list")
