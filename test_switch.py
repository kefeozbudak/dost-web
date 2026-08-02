with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()
idx1 = code.find("switch (block.type) {")
idx2 = code.find("if (block.type === 'achievements_hero') {")
print(f"switch starts at {idx1}, achievements_hero is at {idx2}")
print(code[idx2-200:idx2+50])
