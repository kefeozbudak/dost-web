with open('src/admin/hubs/ReportCenter.tsx', 'r') as f:
    code = f.read()

target = """      if (lowerKey.includes('formname')) return;"""
new_target = """      if (lowerKey.includes('formname') || lowerKey.includes('kvkk')) return;"""

if target in code:
    code = code.replace(target, new_target)
    with open('src/admin/hubs/ReportCenter.tsx', 'w') as f:
        f.write(code)
    print("Patched kvkk ignore")
else:
    print("Target 3 not found")
