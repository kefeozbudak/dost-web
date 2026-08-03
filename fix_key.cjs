const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');
content = content.replace(
    /\{key: 'icon', label: 'İkon \(Opsiyonel\)', type: 'icon'\},\s*/g,
    ''
);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Fixed duplicate key");
