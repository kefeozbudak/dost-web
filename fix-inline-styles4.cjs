const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/style=\{\{\s*color:\s*item\.buttonTextColor \|\|\s*block\.styles\?\.cardAccentColor \|\|\s*"#1d4eca",\s*\}\}/g, 'style={getCardButtonStyle(item, block)}');

fs.writeFileSync('src/components/PageBlocks.tsx', code);
