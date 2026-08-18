const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const academicCalendarFind = `                <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center whitespace-normal md:whitespace-pre-line">
                  <span
                    className="material-symbols-outlined whitespace-normal md:whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    chevron_left
                  </span>
                </button>
                <h2 className="font-headline-xl text-headline-xl text-on-surface whitespace-normal md:whitespace-pre-line">
                  {block.month || "Ekim 2023"}
                </h2>
                <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center whitespace-normal md:whitespace-pre-line">
                  <span
                    className="material-symbols-outlined whitespace-normal md:whitespace-pre-line"
                    translate="no"
                    aria-hidden="true"
                  >
                    chevron_right
                  </span>
                </button>`;

const academicCalendarReplace = `                <button onClick={() => setCalendarMonthOffsets(prev => ({...prev, [index]: (prev[index] || 0) - 1}))} className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center whitespace-normal md:whitespace-pre-line">
                  <span className="material-symbols-outlined whitespace-normal md:whitespace-pre-line" translate="no" aria-hidden="true">chevron_left</span>
                </button>
                <h2 className="font-headline-xl text-headline-xl text-on-surface whitespace-normal md:whitespace-pre-line">
                  {getNavMonthYear(block.month || "Ekim 2023", calendarMonthOffsets[index] || 0)}
                </h2>
                <button onClick={() => setCalendarMonthOffsets(prev => ({...prev, [index]: (prev[index] || 0) + 1}))} className="p-2 rounded-full hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center whitespace-normal md:whitespace-pre-line">
                  <span className="material-symbols-outlined whitespace-normal md:whitespace-pre-line" translate="no" aria-hidden="true">chevron_right</span>
                </button>`;

code = code.replace(academicCalendarFind, academicCalendarReplace);

// pass offset to getAlignedCalendarDays in academic_calendar
code = code.replace(
  /\{getAlignedCalendarDays\(block\.month, block\.days\)\?\.map\(\(day: any, i: number\) \=\> \{/g,
  `{getAlignedCalendarDays(block.month, block.days, calendarMonthOffsets[index] || 0)?.map((day: any, i: number) => {`
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
