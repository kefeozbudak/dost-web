import re

with open('src/admin/BlockFormEditor.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    if "{renderCommonFields()}" in line:
        new_lines.append(line)
        i += 1
        # Skip title if it's there
        if i < len(lines) and "{renderTextareaWithStyle('Başlık', 'title')}" in lines[i]:
            i += 1
        # Skip subtitle if it's there
        if i < len(lines) and "{renderTextareaWithStyle('Alt Başlık', 'subtitle')}" in lines[i]:
            i += 1
        continue
    new_lines.append(line)
    i += 1

with open('src/admin/BlockFormEditor.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
