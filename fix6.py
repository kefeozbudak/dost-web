with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

start_idx = code.find('{type === "quick_contact_form" ? (')
print(repr(code[start_idx-20:start_idx+800]))
