const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

code = code.replace(/<\/div>\n                <\/div>\n                \n                <label className="text-\[10px\] font-bold text-slate-400 block mb-1 mt-3">/g, `</div>
                
                <label className="text-[10px] font-bold text-slate-400 block mb-1 mt-3">`);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
