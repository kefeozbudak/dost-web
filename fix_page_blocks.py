import re

with open('src/components/PageBlocks.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace block.fullWidth with (block.fullWidth || block.styles?.fullWidth)
content = content.replace('block.fullWidth ?', '(block.fullWidth || block.styles?.fullWidth) ?')

# Add style={getStyle(block, '')} to <section> or <div> that are the root of a block, if they don't have it
# It's a bit tricky. We can look for return ( <section or return ( <div
# Let's just do manual replacements for the main ones.

with open('src/components/PageBlocks.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
