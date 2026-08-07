import re
with open("src/components/PageBlocks.tsx", "r") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "return (" in line and i > 6300:
        print(f"Line {i+1}: {repr(line)}")
