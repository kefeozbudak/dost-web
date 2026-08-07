with open("src/components/PageBlocks.tsx", "r") as f:
    c = f.read()

target = '        );\n        if (block.type === "tuition_fees") {'
replacement = '        );\n      }\n      if (block.type === "tuition_fees") {'
if target in c:
    c = c.replace(target, replacement)
    with open("src/components/PageBlocks.tsx", "w") as f:
        f.write(c)
    print("Fixed brace!")
else:
    print("Target not found!")
