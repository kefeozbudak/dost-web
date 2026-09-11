const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// The first fix applied was:
// isToday: typeof bestMatch.isToday === 'boolean' ? bestMatch.isToday : isActualToday,
// Let's verify it worked.
if (!content.includes("typeof bestMatch.isToday === 'boolean'")) {
    console.log("Not applied step 1");
}

// I want to just rewrite the render blocks for menu_calendar and academic_calendar to prioritize day.isToday over day.isWeekend.
// Let's find the menu_calendar render block.
const menuCalendarRenderOriginal = `                      if (day.isWeekend) {
                        return (
                          <div
                            key={i}
                            data-editor-item-index={day._oIndex !== undefined && day._oIndex !== -1 ? day._oIndex : (parseInt(day.date)-1)}
                            data-editor-array-key="days"
                            className="p-2 md:p-4 hover:bg-slate-50 transition-colors group min-h-[120px] md:min-h-[220px] bg-red-50/30 whitespace-normal md:whitespace-pre-line"
                          >
                            <div className="flex flex-col md:flex-row md:justify-between items-start gap-1 mb-3 whitespace-normal md:whitespace-pre-line">
                              <span className="text-sm md:text-xl font-black text-slate-800 whitespace-normal md:whitespace-pre-line">
                                {day.date}
                              </span>
                              <span
                                className={\`text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full bg-red-100 text-red-600 uppercase \${block.styles?.textAlign ? "" : "text-center"}\`}
                              >
                                Hafta Sonu
                              </span>
                            </div>
                          </div>
                        );
                      }

                      if (day.isToday) {`;
                      
// Wait, my previous replacement might have messed it up. Let's look at lines 6270 to 6360.
