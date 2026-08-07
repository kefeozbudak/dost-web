with open("src/components/PageBlocks.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'if (block.type === "middle_school_hero")' in line:
        start = i
        break

print("".join(lines[start:start+20]))
print("...")
print("".join(lines[-40:]))
