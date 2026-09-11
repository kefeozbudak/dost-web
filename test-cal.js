const getAlignedCalendarDays = (blockMonth, originalDays, monthOffset = 0) => {
  if (!originalDays || !Array.isArray(originalDays)) return [];
      
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let mIndex = currentDate.getMonth();

  if (blockMonth) {
    const monthMap = {
      "ocak": 0, "şubat": 1, "subat": 1, "mart": 2, "nisan": 3,
      "mayıs": 4, "mayis": 4, "haziran": 5, "temmuz": 6, "ağustos": 7, "agustos": 7,
      "eylül": 8, "eylul": 8, "ekim": 9, "kasım": 10, "kasim": 10, "aralık": 11, "aralik": 11
    };
        
    const lowerMonth = blockMonth.toLocaleLowerCase('tr-TR').replace(/i̇/g, 'i');
    for (const [m, idx] of Object.entries(monthMap)) {
      if (lowerMonth.includes(m)) {
        mIndex = idx;
        break;
      }
    }
    const yearMatch = blockMonth.match(/\d{4}/);
    if (yearMatch) year = parseInt(yearMatch[0]);
  }

  mIndex += monthOffset;
  while (mIndex > 11) { mIndex -= 12; year++; }
  while (mIndex < 0) { mIndex += 12; year--; }

  const daysInMonth = new Date(year, mIndex + 1, 0).getDate();
  const firstDay = new Date(year, mIndex, 1).getDay();
  const paddingCount = firstDay === 0 ? 6 : firstDay - 1;
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

  const realCurrentDate = new Date();
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
            events: [],
            meals: [],
            isToday: isActualToday
        });
    }
  }
  return alignedDays;
};

const res = getAlignedCalendarDays(undefined, [{date: "19", isToday: true, meals: "test"}]);
const today = res.find(d => d.isToday);
console.log("Today is:", today);
console.log("Day 19 is:", res.find(d => d.date === "19"));
