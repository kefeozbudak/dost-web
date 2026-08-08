const fs = require('fs');

const files = [
  'src/admin/BlockFormEditor.tsx',
  'src/admin/hubs/PopupCenter.tsx',
  'src/admin/hubs/SettingsCenter.tsx',
  'src/admin/hubs/AppearanceCenter.tsx',
  'src/admin/components/FieldStylePicker.tsx'
];

for (let file of files) {
    let code = fs.readFileSync(file, 'utf8');
    
    // Replace `} }` at the end of a line with `}`
    // But we already did `sed -i "s/} }/}/g"` on FieldStylePicker!
    // Let's do it cleanly for all files:
    code = code.replace(/value=\{([^}]+)\}\s*\}/g, 'value={$1}');
    
    fs.writeFileSync(file, code);
}
console.log("Fixed extra braces");
