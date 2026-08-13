const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// The early blocks also have hardcoded inline styles.
content = content.replace(
    /style=\{\{\s*backgroundColor:\s*item\.cardBgColor\s*\|\|\s*undefined,\s*borderColor:\s*item\.cardBorderColor\s*\|\|\s*undefined,\s*borderWidth:\s*item\.cardBorderWidth\s*\|\|\s*undefined,\s*borderRadius:\s*item\.cardBorderRadius\s*\|\|\s*undefined,\s*padding:\s*item\.cardPadding\s*\|\|\s*undefined,\s*boxShadow:\s*item\.cardShadow\s*===\s*"none"\s*\?\s*"none"\s*:\s*item\.cardShadow\s*\?\s*`var\(--tw-shadow-\$\{item\.cardShadow\}\)`\s*:\s*undefined,\s*\}\}/g,
    "style={getCardStyle(item, block)}"
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched other inline styles in PageBlocks");
