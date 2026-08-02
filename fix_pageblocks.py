with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

# find news_grid title and desc
old_title = "{item.title && <h3 style={getItemTitleStyle(block)} className=\"font-headline-md text-xl md:text-headline-md mb-3 group-hover:text-primary transition-colors line-clamp-2\">{item.title}</h3>}"
new_title = "{item.title && <h3 style={{ ...getItemTitleStyle(block), color: item.itemTitleColor || getItemTitleStyle(block).color }} className=\"font-headline-md text-xl md:text-headline-md mb-3 group-hover:text-primary transition-colors line-clamp-2\">{item.title}</h3>}"

old_desc = "{item.desc && <p style={getItemDescStyle(block)} className=\"font-body-md text-sm md:text-body-md text-on-surface-variant mb-6 line-clamp-3\">{item.desc}</p>}"
new_desc = "{item.desc && <p style={{ ...getItemDescStyle(block), color: item.itemDescColor || getItemDescStyle(block).color }} className=\"font-body-md text-sm md:text-body-md text-on-surface-variant mb-6 line-clamp-3\">{item.desc}</p>}"

if old_title in code:
    code = code.replace(old_title, new_title)
if old_desc in code:
    code = code.replace(old_desc, new_desc)

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)
print("Updated item title and desc colors")
