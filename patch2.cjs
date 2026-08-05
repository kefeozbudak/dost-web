const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');
file = file.replace("await setDoc(doc(db, 'settings', 'footer'), footerData);", "await setDoc(doc(db, 'settings', 'footer'), sanitizeData(footerData));");
fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
