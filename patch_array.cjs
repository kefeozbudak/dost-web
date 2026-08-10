const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');
content = content.replace(
  'handleChange(arrayKey, [...currentArray, newItem]);',
  'handleChange(arrayKey, arrayKey === "inputs" ? [...currentArray, newItem] : [newItem, ...currentArray]);'
);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Patched array prepend");
