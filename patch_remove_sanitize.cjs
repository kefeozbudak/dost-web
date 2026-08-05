const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');

file = file.replace(/const sanitizeData = \\(obj: any\\): any => \\{[\\s\\S]*?return obj;\\n  \\};/, '');
file = file.replace("sanitizeData(headerData)", "headerData");
file = file.replace("sanitizeData(footerData)", "footerData");

fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
