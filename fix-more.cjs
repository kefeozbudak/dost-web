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
    
    // Sometimes `value={...} }` might be across lines if formatted weirdly, but usually it's `value={...} }`
    code = code.replace(/\}\s*\}/g, '}'); // wait, this is too broad and breaks things!
    
    // Instead of messing around, I should wait for the lint output.
}
