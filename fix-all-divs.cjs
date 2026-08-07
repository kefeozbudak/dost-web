const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

code = code.replace(/<\/div>\s*<\/div>\s*<label className="text-\[10px\] font-bold text-slate-400 block mb-1 mt-3">\s*Kart Arka Plan Görseli/g, `</div>\n                \n                <label className="text-[10px] font-bold text-slate-400 block mb-1 mt-3">\n                  Kart Arka Plan Görseli`);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
