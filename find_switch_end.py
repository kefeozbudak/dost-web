with open('src/components/PageBlocks.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

switch_idx = content.find('switch (block.type) {')
end_switch_idx = content.find('      }\n    };\n\n    if (block.isHidden', switch_idx)
print(end_switch_idx)
