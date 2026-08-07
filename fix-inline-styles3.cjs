const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/style=\{\{\s*color:\s*item\.itemTitleColor \|\|\s*block\.styles\?\.cardTitleColor \|\|\s*"#ffffff",\s*\}\}/g, 'style={getCardTitleStyle(item, block)}');
code = code.replace(/style=\{\{\s*color:\s*item\.itemDescColor \|\|\s*block\.styles\?\.cardAccentColor \|\|\s*"#1d4eca",\s*\}\}/g, 'style={getCardDescStyle(item, block)}');

fs.writeFileSync('src/components/PageBlocks.tsx', code);
