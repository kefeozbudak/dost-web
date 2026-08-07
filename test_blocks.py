with open('src/components/PageBlocks.tsx', 'r') as f:
    c = f.read()

target = 'const renderBlock = (block: any, index: number) => {'
replacement = target + '\n    console.log("Rendering block:", block.type);\n'
if target in c:
    c = c.replace(target, replacement)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(c)
    print("Patched PageBlocks.tsx")
else:
    print("Target not found")
