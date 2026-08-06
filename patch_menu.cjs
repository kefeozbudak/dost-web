const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const targetMenu = `            <div className="\${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">`;

const replaceMenu = `            <div className="\${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-desktop">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden overflow-x-auto">
                <div className="min-w-[800px]">
                <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">`;

const endMenu = `                  {Array.from({ length: Math.max(0, 35 - (block.days?.length || 0)) }).map((_, i) => (
                    <div key={\`empty-\${i}\`} className="p-2 md:p-4 bg-slate-50/50 min-h-[120px] md:min-h-[220px]"></div>
                  ))}
                </div>
              </div>
            </div>
          </section>`;

const replaceEndMenu = `                  {Array.from({ length: Math.max(0, 35 - (block.days?.length || 0)) }).map((_, i) => (
                    <div key={\`empty-\${i}\`} className="p-2 md:p-4 bg-slate-50/50 min-h-[120px] md:min-h-[220px]"></div>
                  ))}
                </div>
                </div>
              </div>
            </div>
          </section>`;

content = content.replace(targetMenu, replaceMenu);
content = content.replace(endMenu, replaceEndMenu);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched menu_calendar");
