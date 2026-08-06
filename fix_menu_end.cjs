const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

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

content = content.replace(endMenu, replaceEndMenu);
fs.writeFileSync('src/components/PageBlocks.tsx', content);
