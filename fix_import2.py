with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

code = code.replace('DEFAULT_CONTACT_INPUTS,', 'DEFAULT_CONTACT_INPUTS, DEFAULT_QUICK_CONTACT_INPUTS,')

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)

print("Fixed import!")
