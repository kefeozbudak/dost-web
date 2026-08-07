const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

code = code.replace(/className="w-full text-xs border-slate-300 rounded p-1\.5"\s*\/>\s*<div>\s*<label className="text-\[10px\] font-bold text-slate-400 block mb-1">/g, 'className="w-full text-xs border-slate-300 rounded p-1.5"\n                          />\n                        </div>\n\n                        <div>\n                          <label className="text-[10px] font-bold text-slate-400 block mb-1">');

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
