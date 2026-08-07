const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const lines = code.split('\n');
// lines[1871] is index 1871 (since it's 1-indexed in cat -n).
// Wait, to be safe, I'll find it by content.

code = code.replace(/className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none font-mono"\n                  \/>\n                <\/div>\n                <\/div>/, 'className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none font-mono"\n                  />\n                </div>');

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
