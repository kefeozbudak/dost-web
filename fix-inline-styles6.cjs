const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/style=\{\{\s*color:\s*block\.styles\?\.titlePart1Color\s*\}\}/g, 'style={getTitleStyle(block)}');
code = code.replace(/style=\{\{\s*color:\s*block\.styles\?\.color\s*\}\}/g, 'style={getSubtitleStyle(block)}');

fs.writeFileSync('src/components/PageBlocks.tsx', code);
