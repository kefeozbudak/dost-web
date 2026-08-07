const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/(\n\}: any\) => \{)/g, ',\n  getIconStyle$1');

fs.writeFileSync('src/components/PageBlocks.tsx', code);
