const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/style=\{\{\s*color:\s*legend\.itemTitleColor\s*\}\}/g, 'style={getCardTitleStyle(legend, block)}');
code = code.replace(/style=\{\{\s*color:\s*legend\.itemDescColor\s*\}\}/g, 'style={getCardDescStyle(legend, block)}');

fs.writeFileSync('src/components/PageBlocks.tsx', code);
