with open("src/components/PageBlocks.tsx", "r") as f:
    c = f.read()

c = c.replace('console.log("REACHED END!");\n', '')
c = c.replace("  console.log('DynamicBlockRenderer blocks:', blocks);\n", '')
c = c.replace('    console.log("Rendering block:", block.type);\n', '')

with open("src/components/PageBlocks.tsx", "w") as f:
    f.write(c)
