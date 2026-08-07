with open('src/components/PageBlocks.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("  if (!blocks || !Array.isArray(blocks)) return null;", "  console.log('DynamicBlockRenderer blocks:', blocks);\n  if (!blocks || !Array.isArray(blocks)) return null;")

with open('src/components/PageBlocks.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Added console.log")
