const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/style=\{\{\s*\.\.\.getStyle\(block,\s*"sidebarSubtitle"\),\s*color:\s*block\.styles\?\.sidebarSubtitleColor\s*\|\|\s*block\.styles\?\.sidebarTextColor\s*\|\|\s*"#6b7280",\s*\}\}/g, 'style={getStyle(block, "sidebarSubtitle")}');

fs.writeFileSync('src/components/PageBlocks.tsx', code);
