with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

idx = code.find('const renderInputWithStyle')
print(code[idx:idx+300])
