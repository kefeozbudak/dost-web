import re

with open('src/components/PageBlocks.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("        );\nif (block.type === 'tuition_fees') {", "        );\n      }\n      if (block.type === 'tuition_fees') {")

with open('src/components/PageBlocks.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed missing brace")
