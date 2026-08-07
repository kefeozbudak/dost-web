const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Remove previously added getIconStyle={getIconStyle}
code = code.replace(/getIconStyle=\{getIconStyle\}\n\s*/g, '');

// Now add it to all blocks after getStyle={getStyle}
code = code.replace(/getStyle=\{getStyle\}/g, "getStyle={getStyle}\n              getIconStyle={getIconStyle}");

fs.writeFileSync('src/components/PageBlocks.tsx', code);
