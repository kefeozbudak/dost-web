import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

# We need to make the tags in akademik_kadro use cardTitleColor / cardTextColor etc.
# specifically replace:
# <h3 className="text-lg font-bold mb-1" style={{ color: item.itemTitleColor || '#ffffff' }}>{item.title}</h3>
# with
# <h3 className="text-lg font-bold mb-1" style={{ color: item.itemTitleColor || block.styles?.cardTitleColor || '#ffffff' }}>{item.title}</h3>

code = code.replace("color: item.itemTitleColor || '#ffffff'", "color: item.itemTitleColor || block.styles?.cardTitleColor || '#ffffff'")
code = code.replace("color: item.itemDescColor || '#1d4eca'", "color: item.itemDescColor || block.styles?.cardAccentColor || '#1d4eca'")
code = code.replace("color: item.itemTextColor || '#9ca3af'", "color: item.itemTextColor || block.styles?.cardTextColor || '#9ca3af'")
code = code.replace("color: item.buttonTextColor || '#1d4eca'", "color: item.buttonTextColor || block.styles?.cardAccentColor || '#1d4eca'")

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)

print("Patched PageBlocks.tsx to use new global card color fields for akademik_kadro")
