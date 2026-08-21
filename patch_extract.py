with open('src/admin/hubs/ReportCenter.tsx', 'r') as f:
    code = f.read()

target = """      if (lowerKey.includes('kademe') || lowerKey.includes('sınıf') || lowerKey.includes('eğitim') || lowerKey.includes('grade') || lowerKey.includes('class')) {
        if (!kademe) kademe = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes('kampüs') || lowerKey.includes('kampus') || lowerKey.includes('campus')) {"""

new_target = """      if (lowerKey.includes('kademe') || lowerKey.includes('sınıf') || lowerKey.includes('eğitim') || lowerKey.includes('grade') || lowerKey.includes('class') || lowerKey.includes('education')) {
        if (!kademe) kademe = String(val);
        else otherFields.push({ label, value: val });
      } else if (lowerKey.includes('kampüs') || lowerKey.includes('kampus') || lowerKey.includes('campus')) {"""

if target in code:
    code = code.replace(target, new_target)
    with open('src/admin/hubs/ReportCenter.tsx', 'w') as f:
        f.write(code)
    print("Patched kademe")
else:
    print("Target 1 not found")
