const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const startIndex = code.indexOf('case "quote_image":');
const endIndex = code.indexOf('case "academic_hero":', startIndex);
let blockCode = code.substring(startIndex, endIndex);

blockCode = blockCode.replace(
  /style=\{getStyle\(block, ""\)\}/g,
  'style={getStyle(block, "container")}'
);

code = code.substring(0, startIndex) + blockCode + code.substring(endIndex);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("quote_image container style fixed");
