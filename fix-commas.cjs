const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/,,/g, ',');

fs.writeFileSync('src/components/PageBlocks.tsx', code);
