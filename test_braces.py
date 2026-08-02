with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

idx = code.find("block.type === 'achievements_hero'")
print(f"achievements_hero found at {idx}")

# find the outer function
idx_func = code.find("export default function BlockFormEditor")
print(f"func found at {idx_func}")

# test nesting
idx_hero = code.find("block.type === 'hero'")
print(f"hero found at {idx_hero}")

# print what is around achievements_hero
print(code[idx-100:idx+100])
