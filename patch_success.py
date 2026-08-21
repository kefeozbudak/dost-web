import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = '        ) : type === "contact_form" ? ('
new_target = '        ) : (type === "contact_form" || type === "quick_contact_form") ? ('
code = code.replace(target, new_target)

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)

print("Patched success message")
