const fs = require('fs');
const file = 'src/admin/components/FieldStylePicker.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/val \? val \+ 'px' : ''/g, 'val');
fs.writeFileSync(file, content);
console.log("Patched px in FieldStylePicker");
