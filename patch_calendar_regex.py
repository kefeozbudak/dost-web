import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

pattern = re.compile(
    r'(for \(let i = 1; i <= daysInMonth; i\+\+.*?_oIndex: bestMatchIndex\s*}\);\s*\} else \{\s*alignedDays\.push\(\{.*?meals: \[\]\s*}\);\s*\}\s*\})',
    re.DOTALL
)

def replace_func(match):
    block = match.group(1)
    # Insert real date calculation just before the loop
    # And inject isToday: isActualToday logic
    header = """  const realCurrentDate = new Date();
  const realTodayYear = realCurrentDate.getFullYear();
  const realTodayMonth = realCurrentDate.getMonth();
  const realTodayDate = realCurrentDate.getDate();\n\n"""
    
    # insert isActualToday definition
    block = block.replace("const isWeekend = new Date(year, mIndex, i).getDay() === 0 || new Date(year, mIndex, i).getDay() === 6;", 
                          "const isWeekend = new Date(year, mIndex, i).getDay() === 0 || new Date(year, mIndex, i).getDay() === 6;\n    const isActualToday = (year === realTodayYear && mIndex === realTodayMonth && i === realTodayDate);")
    
    # replace the pushes
    block = block.replace("_oIndex: bestMatchIndex", "isToday: isActualToday,\n            _oIndex: bestMatchIndex")
    block = block.replace("meals: []", "meals: [],\n            isToday: isActualToday")
    
    return header + block

new_code = pattern.sub(replace_func, code, count=1)

if code != new_code:
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(new_code)
    print("Successfully patched via regex")
else:
    print("Regex match failed")
