const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

code = code.replace(/className="flex-1 px-2 py-1\.5 border border-slate-200 rounded text-xs outline-none"\s*\/>/g, 'className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs outline-none"\n                  />\n                </div>');
code = code.replace(/className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none font-mono"\s*\/>/g, 'className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none font-mono"\n                  />\n                </div>');

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
