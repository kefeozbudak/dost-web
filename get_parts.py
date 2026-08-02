with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

# Let's find all instances of `if (block.type === 'achievements_academic_bento') {`
# and remove them.
# The whole block ends with `if (block.type === 'achievements_science_projects') { ... }`

idx_bento = code.find("if (block.type === 'achievements_academic_bento') {")
print(f"bento at {idx_bento}")

