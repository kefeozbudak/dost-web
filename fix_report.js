const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/ReportCenter.tsx', 'utf8');
code = code.replace(/\\\`/g, '`');
code = code.replace(/\\\$/g, '$');
fs.writeFileSync('src/admin/hubs/ReportCenter.tsx', code);
