with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

idx_getStyle = code.find("  const getStyle = (block: any, prefix: string) => {")
print(repr(code[idx_getStyle-50:idx_getStyle]))
