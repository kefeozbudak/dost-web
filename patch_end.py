with open("src/components/PageBlocks.tsx", "r") as f:
    c = f.read()

target = '  return (\n    <>{blocks.map((block: any, index: number) => renderBlock(block, index))}</>\n  );\n};'
replacement = '  console.log("REACHED END!");\n' + target

if target in c:
    c = c.replace(target, replacement)
    with open("src/components/PageBlocks.tsx", "w") as f:
        f.write(c)
    print("Patched end")
else:
    print("Target not found")
