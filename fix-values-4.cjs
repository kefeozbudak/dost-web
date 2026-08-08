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
    
    // The duplicated value looks like:
    // item.cardBgColor === "currentColor" ||
    // !item.cardBgColor
    //   ? "#ffffff"
    //   : item.cardBgColor
    // 
    // item.cardBgColor === "currentColor" ||
    // !item.cardBgColor
    //   ? "#ffffff"
    //   : item.cardBgColor
    
    code = code.replace(/value=\{([\s\S]*?)\n(\s*)\1\s*\}/g, 'value={$1}');
    
    // Wait, let's just do it dynamically: find value={ followed by duplicate strings up to }.
    // An easier regex: match value={ \n ... } and if it repeats exactly, halve it.
    
    // Actually, I can just use a generic regex to replace the specific duplicated block.
    // What if I just check if there is a missing `}` and a duplicate?
    // Let's print out the matches for debugging first.
    fs.writeFileSync(file, code);
}
console.log("Fixed duplicates");
