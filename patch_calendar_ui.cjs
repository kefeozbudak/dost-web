const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const navCode = `
  const getNavMonthYear = (baseMonth: string, offset: number) => {
    const monthNames = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
    let mIndex = new Date().getMonth();
    let year = new Date().getFullYear();
    
    if (baseMonth) {
      const lowerMonth = baseMonth.toLocaleLowerCase('tr-TR').replace(/i̇/g, 'i');
      for (let i=0; i<monthNames.length; i++) {
        if (lowerMonth.includes(monthNames[i].toLocaleLowerCase('tr-TR'))) { mIndex = i; break; }
      }
      const ym = baseMonth.match(/\\d{4}/);
      if (ym) year = parseInt(ym[0]);
    }
    
    mIndex += offset;
    while(mIndex > 11) { mIndex -= 12; year++; }
    while(mIndex < 0) { mIndex += 12; year--; }
    return \`\${monthNames[mIndex]} \${year}\`;
  };
`;

code = code.replace(/const processedBlocks: any\[\] = blocks;/, `$&${navCode}`);

// For menu_calendar
const menuCalendarFind = `                <h2
                  className="text-2xl font-bold text-slate-800 whitespace-normal md:whitespace-pre-line"
                  style={getTitleStyle(block)}
                >
                  {block.title}
                </h2>`;

const menuCalendarReplace = `                <div className="flex items-center gap-4">
                  <button onClick={() => setCalendarMonthOffsets(prev => ({...prev, [index]: (prev[index] || 0) - 1}))} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
                  <h2
                    className="text-2xl font-bold text-slate-800 whitespace-normal md:whitespace-pre-line"
                    style={getTitleStyle(block)}
                  >
                    {getNavMonthYear(block.month || block.title, calendarMonthOffsets[index] || 0)}
                  </h2>
                  <button onClick={() => setCalendarMonthOffsets(prev => ({...prev, [index]: (prev[index] || 0) + 1}))} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                </div>`;

code = code.replace(menuCalendarFind, menuCalendarReplace);

// We must also pass the offset to getAlignedCalendarDays inside menu_calendar
code = code.replace(
  /\{getAlignedCalendarDays\(block\.month, block\.days\)\?\.map\(\(day: any, i: number\) \=\> \{/g,
  `{getAlignedCalendarDays(block.month, block.days, calendarMonthOffsets[index] || 0)?.map((day: any, i: number) => {`
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
