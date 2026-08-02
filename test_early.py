with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

idx1 = code.find("export default function BlockFormEditor")
idx2 = code.find("return (", idx1)
print(code[idx1:idx2])
