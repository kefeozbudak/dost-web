import re
with open("src/components/PageBlocks.tsx", "r") as f:
    lines = f.readlines()

in_renderer = False
for i, line in enumerate(lines):
    if "export const DynamicBlockRenderer" in line:
        in_renderer = True
    
    if in_renderer and "return" in line:
        print(f"Line {i+1}: {line.rstrip()}")
        
    if in_renderer and line.startswith("};"):
        in_renderer = False
