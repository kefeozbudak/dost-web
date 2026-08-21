with open('src/admin/hubs/ReportCenter.tsx', 'r') as f:
    code = f.read()

target2 = """      } else if (lowerKey.includes('mesaj') || lowerKey.includes('not') || lowerKey.includes('açıklama') || lowerKey.includes('notes')) {"""
new_target2 = """      } else if (lowerKey.includes('mesaj') || lowerKey.includes('not') || lowerKey.includes('açıklama') || lowerKey.includes('notes') || lowerKey.includes('message')) {"""

if target2 in code:
    code = code.replace(target2, new_target2)
    with open('src/admin/hubs/ReportCenter.tsx', 'w') as f:
        f.write(code)
    print("Patched message")
else:
    print("Target 2 not found")
