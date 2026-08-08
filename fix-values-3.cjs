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
    
    // Fix missing closing brace
    code = code.replace(/value=\{([^\n]*?)\n(\s*)onChange=\{/g, (match, p1, p2) => {
        if (!p1.endsWith('}')) {
            return `value={${p1}}\n${p2}onChange={`;
        }
        return match;
    });
    
    // Apply proper transparent handling
    code = code.replace(/value=\{([^}]+)\}/g, (match, valExpr) => {
        // Skip if not immediately preceded by type="color" in the lines above
        // This regex approach is getting messy. Let's just fix the missing '}' first.
        return match;
    });

    fs.writeFileSync(file, code);
}
console.log("Fixed missing braces.");
