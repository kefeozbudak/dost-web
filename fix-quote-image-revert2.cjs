const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(
  /style=\{\{\.\.\.getStyle\(block, "quote"\), whiteSpace: "pre-line"\}\}/g,
  'style={getSubtitleStyle(block)}'
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
