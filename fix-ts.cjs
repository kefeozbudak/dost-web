const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/LgsCenter.tsx', 'utf8');
code = code.replace(/const typedSubj = subj;/, 'const typedSubj = subj as any;');
fs.writeFileSync('src/admin/hubs/LgsCenter.tsx', code);
