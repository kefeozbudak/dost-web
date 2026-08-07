import re
with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    lines = f.readlines()

stack = []
for i, line in enumerate(lines):
    if '<div' in line and not '</div>' in line and not '/>' in line.split('<div')[-1]:
        stack.append(i)
    elif '</div>' in line and not '<div' in line:
        if len(stack) > 0:
            stack.pop()
        else:
            print(f"Unbalanced closing div at line {i+1}")
