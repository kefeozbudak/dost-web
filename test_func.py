with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

idx = code.find("  const renderBlock = (block: any, index: number) => {")
print(f"renderBlock starts at {idx}")

idx_content = code.find("    const renderContent = () => {", idx)
print(f"renderContent starts at {idx_content}")

idx_hero = code.find("if (block.type === 'achievements_hero') {")
print(f"achievements_hero at {idx_hero}")
