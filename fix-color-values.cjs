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
    
    // Replace: value={... || "#ffffff"} or similar on type="color"
    // It's a bit hard to target ONLY type="color" values safely with regex,
    // but let's try to target the known pattern inside type="color" inputs.
    // Instead, I can just replace `value={EXPR}` with `value={EXPR === 'transparent' ? '#ffffff' : (EXPR)}`
    // Wait, the easiest way is just to add a regex that looks for `<input\s+type="color"[\s\S]*?value=\{([^}]+)\}` and changes it.
    
    code = code.replace(/<input\s+type="color"[\s\S]*?value=\{([^}]+)\}/g, (match, valExpr) => {
        // If it already handles 'transparent', skip
        if (valExpr.includes("=== 'transparent'")) return match;
        if (valExpr.includes('=== "transparent"')) return match;
        
        let newMatch = match.replace(`value={${valExpr}}`, `value={${valExpr} === 'transparent' ? '#ffffff' : ${valExpr}}`);
        return newMatch;
    });

    fs.writeFileSync(file, code);
    console.log("Updated", file);
}
