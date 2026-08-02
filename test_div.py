with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "<div className=\"space-y-6\">" in line:
        print(f"space-y-6 at line {i+1}")
    if "<MediaPickerModal" in line:
        print(f"MediaPickerModal at line {i+1}")
