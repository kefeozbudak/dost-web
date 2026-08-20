import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = i.toString();
    const padStr = i < 10 ? `0${i}` : dayStr;
    const isWeekend = new Date(year, mIndex, i).getDay() === 0 || new Date(year, mIndex, i).getDay() === 6;
    
    let bestMatchIndex = -1;
    let bestMatch = null;
    for (let j = 0; j < originalDays.length; j++) {
      const d = originalDays[j];
      if (!d) continue;
      
      const oDate = String(d.date || "").replace(/\D/g, '');
      if (oDate === dayStr || oDate === padStr || parseInt(oDate) === i) {
          bestMatch = d;
          bestMatchIndex = j;
          break;
      }
    }

    if (bestMatch) {
        alignedDays.push({
            ...bestMatch,
            date: dayStr,
            isCurrentMonth: true,
            isWeekend: isWeekend,
            _oIndex: bestMatchIndex 
         });
    } else {
        alignedDays.push({
            date: dayStr,
            isCurrentMonth: true,
            isWeekend: isWeekend,
            events: [],
            meals: []
        });
    }
  }"""

new_logic = """  const realCurrentDate = new Date();
  const realTodayYear = realCurrentDate.getFullYear();
  const realTodayMonth = realCurrentDate.getMonth();
  const realTodayDate = realCurrentDate.getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = i.toString();
    const padStr = i < 10 ? `0${i}` : dayStr;
    const isWeekend = new Date(year, mIndex, i).getDay() === 0 || new Date(year, mIndex, i).getDay() === 6;
    
    const isActualToday = (year === realTodayYear && mIndex === realTodayMonth && i === realTodayDate);

    let bestMatchIndex = -1;
    let bestMatch = null;
    for (let j = 0; j < originalDays.length; j++) {
      const d = originalDays[j];
      if (!d) continue;
      
      const oDate = String(d.date || "").replace(/\D/g, '');
      if (oDate === dayStr || oDate === padStr || parseInt(oDate) === i) {
          bestMatch = d;
          bestMatchIndex = j;
          break;
      }
    }

    if (bestMatch) {
        alignedDays.push({
            ...bestMatch,
            date: dayStr,
            isCurrentMonth: true,
            isWeekend: isWeekend,
            isToday: isActualToday,
            _oIndex: bestMatchIndex 
         });
    } else {
        alignedDays.push({
            date: dayStr,
            isCurrentMonth: true,
            isWeekend: isWeekend,
            isToday: isActualToday,
            events: [],
            meals: []
        });
    }
  }"""

if target in code:
    code = code.replace(target, new_logic)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Patched calendar isToday auto logic")
else:
    print("Could not find target calendar logic")
