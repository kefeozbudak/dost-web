import re

with open("src/admin/PageEditor.tsx", "r") as f:
    content = f.read()

# Replace absolute with fixed for the draggable window
content = content.replace('className="absolute z-50 flex flex-col', 'className="fixed z-50 flex flex-col')

with open("src/admin/PageEditor.tsx", "w") as f:
    f.write(content)
