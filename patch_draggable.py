with open("src/admin/PageEditor.tsx", "r") as f:
    content = f.read()

import re

old_style = "style={{ width: '380px', height: '600px', resize: 'both', minWidth: '300px', minHeight: '300px' }}"
new_style = "style={{ top: 0, left: 0, width: '380px', height: '600px', resize: 'both', minWidth: '300px', minHeight: '300px' }}"

content = content.replace(old_style, new_style)

with open("src/admin/PageEditor.tsx", "w") as f:
    f.write(content)
