const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /isToday: isActualToday,/g,
  "isToday: typeof bestMatch.isToday === 'boolean' ? bestMatch.isToday : isActualToday,"
);

// We should also make sure that if it's both isToday and isWeekend, isToday takes precedence or renders with the highlight.
// Let's swap the conditions in menu_calendar.
// menu_calendar has:
// if (day.isWeekend) { return ( ... ) }
// if (day.isToday) { return ( ... ) }

content = content.replace(
  `                      if (day.isWeekend) {
                        return (
                          <div
                            key={i}`,
  `                      if (day.isToday) {
                        return (
                          <div
                            key={i}
                            data-editor-item-index={day._oIndex !== undefined && day._oIndex !== -1 ? day._oIndex : (parseInt(day.date)-1)}
                            data-editor-array-key="days"
                            className="p-2 md:p-4 bg-primary/5 transition-colors ring-1 md:ring-2 ring-inset ring-primary relative min-h-[120px] md:min-h-[220px] whitespace-normal md:whitespace-pre-line"
                          >
                            <div className="absolute -top-1 -right-1 whitespace-normal md:whitespace-pre-line">
                              <span className="flex h-3 w-3 md:h-4 md:w-4 whitespace-normal md:whitespace-pre-line">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 whitespace-normal md:whitespace-pre-line"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 md:h-4 md:w-4 bg-primary whitespace-normal md:whitespace-pre-line"></span>
                              </span>
                            </div>
                            <div className="flex flex-col xl:flex-row xl:justify-between items-start gap-1 mb-3 whitespace-normal md:whitespace-pre-line">
                              <span className="text-sm md:text-xl font-black text-primary whitespace-normal md:whitespace-pre-line">
                                {day.date}
                              </span>
                              <span
                                className={\`text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-primary text-white uppercase \${block.styles?.textAlign ? "" : "text-center"} w-full xl:w-auto\`}
                              >
                                Bugün
                              </span>
                            </div>
                            <ul className="space-y-1 md:space-y-2 whitespace-normal md:whitespace-pre-line">
                              {(Array.isArray(day.meals)
                                ? day.meals
                                : typeof day.meals === "string"
                                  ? day.meals
                                      .split(/[,\n]+/)
                                      .map((s: string) => s.trim())
                                      .filter(Boolean)
                                  : []
                              )?.map((meal: string, mIndex: number) => (
                                <li
                                  key={mIndex}
                                  className="text-[10px] md:text-sm font-bold text-slate-800 flex items-start gap-1 md:gap-2 leading-tight whitespace-normal md:whitespace-pre-line"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 flex-shrink-0 whitespace-normal md:whitespace-pre-line"></span>
                                  <span className="flex-1 whitespace-normal md:whitespace-pre-line">{meal}</span>
                                </li>
                              ))}
                            </ul>
                            {day.kcal && (
                              <div className="mt-3 md:mt-4 inline-block px-1.5 md:px-2 py-0.5 md:py-1 bg-primary/10 text-primary text-[8px] md:text-xs font-bold rounded-full whitespace-normal md:whitespace-pre-line">
                                {day.kcal}
                              </div>
                            )}
                          </div>
                        );
                      }
                      
                      if (day.isWeekend) {
                        return (
                          <div
                            key={i}`
);

// We need to remove the original if (day.isToday) block below if (day.isWeekend) in menu_calendar.
// It's going to be tricky to do exactly with regex without messing up. 
// Let's do it safely.
fs.writeFileSync('src/components/PageBlocks.tsx', content);
