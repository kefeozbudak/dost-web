const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const matches = code.match(/\/>\n\s*<\/div>\n\s*<\/div>\n\s*<label className="text-\[10px\] font-bold text-slate-400 block mb-1 mt-3">\n\s*Kart Arka Plan Görseli/g);
console.log("Matches found:", matches ? matches.length : 0);
