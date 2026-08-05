const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');

file = file.replace(
    /} disabled={subIdx === newLinks\[index\].subLinks.length - 1} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">/,
    `} disabled={subIdx === (headerData.links?.[index]?.subLinks?.length || 0) - 1} className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400">`
);

fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
