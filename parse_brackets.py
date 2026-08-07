with open("src/components/PageBlocks.tsx", "r") as f:
    lines = f.readlines()

depth = 0
in_renderer = False
for i, line in enumerate(lines):
    if "export const DynamicBlockRenderer" in line:
        in_renderer = True
    
    if in_renderer:
        depth += line.count('{') - line.count('}')
        if i == 6348:
            print(f"Line 6348 depth: {depth}")
            break
