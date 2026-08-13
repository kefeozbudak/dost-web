const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

// Also update it in src/components/PageBlocks.tsx line 4347 so we don't have hardcoded styles:
content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
    /style=\{\{\s*backgroundColor:\s*item\.cardBgColor,\s*borderColor:\s*item\.cardBorderColor,\s*borderRadius:\s*item\.cardBorderRadius,\s*\}\}/g,
    "style={getCardStyle(item, block)}"
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched news block inline style");
