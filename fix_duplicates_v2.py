import re

with open('src/admin/BlockFormEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# We want to replace `{renderTextareaWithStyle('Başlık', 'title')}` and 
# `{renderTextareaWithStyle('Alt Başlık', 'subtitle')}`
# But wait, sometimes it's `renderInputWithStyle('Form Başlığı...', 'title')`
# Let's just remove anything that ends with ', 'title')}' or ', 'subtitle')}' 
# IF renderCommonFields() is in the same block.

# Split by block sections. This is a bit tricky, but we can just split by "{block.type ==="
blocks = content.split("{block.type ===")
new_blocks = [blocks[0]]

for block in blocks[1:]:
    if "renderCommonFields()" in block:
        # Remove title calls
        block = re.sub(r'^\s*\{render(?:Textarea|Input)WithStyle\([^,]+,\s*\'title\'\)\}\r?\n', '', block, flags=re.MULTILINE)
        # Remove subtitle calls
        block = re.sub(r'^\s*\{render(?:Textarea|Input)WithStyle\([^,]+,\s*\'subtitle\'\)\}\r?\n', '', block, flags=re.MULTILINE)
    new_blocks.append(block)

new_content = "{block.type ===".join(new_blocks)

with open('src/admin/BlockFormEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)
