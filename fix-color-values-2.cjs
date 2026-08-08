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
    
    // Reverse the previous broken change
    code = code.replace(/ === 'transparent' \? '#ffffff' : (.*?)\} /g, '} ');
    code = code.replace(/ === 'transparent' \? '#ffffff' : ([^\n]*?)\n/g, '\n');
    
    // Apply correctly
    // Wait, the previous replacement was:
    // value={EXPR === 'transparent' ? '#ffffff' : EXPR}
    
    fs.writeFileSync(file, code);
}
console.log("Reverted broken values.");
