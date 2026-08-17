const fs = require('fs');
let content = fs.readFileSync('src/admin/components/FieldStylePicker.tsx', 'utf-8');

content = content.replace('z-[90]', 'z-[99998]');
content = content.replace('z-[100]', 'z-[99999]');

fs.writeFileSync('src/admin/components/FieldStylePicker.tsx', content);
console.log("Patched z-index");
