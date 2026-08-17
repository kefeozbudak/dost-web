const fs = require('fs');
let content = fs.readFileSync('src/admin/components/FieldStylePicker.tsx', 'utf-8');

content = content.replace(
  /onClick=\{\(\) => setIsOpen\(!isOpen\)\}/,
  'onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}'
);

fs.writeFileSync('src/admin/components/FieldStylePicker.tsx', content);
console.log("Patched FieldStylePicker.tsx");
