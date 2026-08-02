with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

idx_renderBlock1 = code.find("  const renderBlock = (block: any, index: number) => {")
idx_getStyle = code.find("  const getStyle = (block: any, prefix: string) => {")

clean_code = code[:idx_renderBlock1] + code[idx_getStyle:]

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(clean_code)

