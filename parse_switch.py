with open("src/components/PageBlocks.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'case "primary_school_bento":' in line:
        start = i
        break

print("".join(lines[start:start+50]))
