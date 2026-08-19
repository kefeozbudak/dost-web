import re
with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """    let bestMatchIndex = -1;
    let bestMatch = null;
    for (let j = 0; j < originalDays.length; j++) {
      const d = originalDays[j];
      if (!d) continue;
      
      const oDate = String(d.date || "").replace(/\\D/g, '');
      if (oDate === dayStr || oDate === padStr || parseInt(oDate) === i) {
          bestMatch = d;
          bestMatchIndex = j;
          break;
      }
    }"""

new_logic = """    let bestMatchIndex = -1;
    let bestMatch = null;
    for (let j = 0; j < originalDays.length; j++) {
      const d = originalDays[j];
      if (!d) continue;
      
      const oDate = String(d.date || "");
      if (oDate.includes('-')) {
          if (oDate === `${year}-${String(mIndex + 1).padStart(2, '0')}-${padStr}`) {
             bestMatch = d;
             bestMatchIndex = j;
             break;
          }
      } else {
          // legacy
          if (monthOffset === 0 && (oDate.replace(/\\D/g, '') === dayStr || parseInt(oDate) === i)) {
             bestMatch = d;
             bestMatchIndex = j;
             break;
          }
      }
    }"""

code = code.replace(target, new_logic)

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)
print("Patched.")
