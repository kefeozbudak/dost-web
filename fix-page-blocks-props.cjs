const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// 1. In DynamicBlockRenderer, find all block invocations and add getIconStyle={getIconStyle}
code = code.replace(/getCardDescStyle=\{getCardDescStyle\}/g, "getCardDescStyle={getCardDescStyle}\n              getIconStyle={getIconStyle}");

fs.writeFileSync('src/components/PageBlocks.tsx', code);
