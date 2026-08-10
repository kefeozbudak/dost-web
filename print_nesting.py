import re

with open("test_parse.tsx", "r") as f:
    lines = f.readlines()

nesting = 0
for i, line in enumerate(lines):
    # naive replacement of strings to avoid counting braces inside them
    # this might be slightly inaccurate but good enough
    clean = re.sub(r'".*?"', '""', line)
    clean = re.sub(r"'.*?'", "''", clean)
    clean = re.sub(r"`.*?`", "``", clean)
    for char in clean:
        if char == '{':
            nesting += 1
        elif char == '}':
            nesting -= 1
    print(f"{i+2}: {nesting} | {line.strip()}")
