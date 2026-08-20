import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """  const paddingCount = firstDay === 0 ? 6 : firstDay - 1;
  const prevMonthLastDate = new Date(year, mIndex, 0).getDate();

  const alignedDays = [];
  for (let i = 0; i < paddingCount; i++) {
    const pDate = (prevMonthLastDate - paddingCount + 1 + i).toString();
    alignedDays.push({
      date: pDate,
      isCurrentMonth: false,
      isWeekend: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
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

new_logic = """  const paddingCount = firstDay === 0 ? 6 : firstDay - 1;
  const prevMonthLastDate = new Date(year, mIndex, 0).getDate();

  const realCurrentDate = new Date();
  const realTodayYear = realCurrentDate.getFullYear();
  const realTodayMonth = realCurrentDate.getMonth();
  const realTodayDate = realCurrentDate.getDate();

  const alignedDays = [];
  for (let i = 0; i < paddingCount; i++) {
    const pDate = (prevMonthLastDate - paddingCount + 1 + i).toString();
    alignedDays.push({
      date: pDate,
      isCurrentMonth: false,
      isWeekend: false,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayStr = i.toString();
    const padStr = i < 10 ? `0${i}` : dayStr;
    const isWeekend = new Date(year, mIndex, i).getDay() === 0 || new Date(year, mIndex, i).getDay() === 6;
    
    // Automatically determine if this cell is today
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
            isToday: isActualToday, // override any static db value with the real automated calculation
            _oIndex: bestMatchIndex 
         });
    } else {
        alignedDays.push({
            date: dayStr,
            isCurrentMonth: true,
            isWeekend: isWeekend,
            isToday: isActualToday, // set automatically
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
