with open("src/components/PageBlocks.tsx", "r") as f:
    lines = f.readlines()

depth = 0
in_renderer = False
for i, line in enumerate(lines):
    if "export const DynamicBlockRenderer" in line:
        in_renderer = True
    
    if in_renderer:
        for c in line:
            if c == '{': depth += 1
            elif c == '}': depth -= 1
        
        if depth == 2 and i > 1724:
            print(f"renderContent might close at {i+1}")
            break
