const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const startIndex = code.indexOf('case "quote_image":');
const endIndex = code.indexOf('case "academic_hero":', startIndex);
let blockCode = code.substring(startIndex, endIndex);

blockCode = blockCode.replace(
  /getStyle\(block, "quote"\) \/\* fallback \*\/ \|\| getStyle\(block, "desc"\)/g,
  '(Object.keys(getStyle(block, "quote")).length > 0 ? getStyle(block, "quote") : getStyle(block, "desc"))'
);

blockCode = blockCode.replace(
  /getStyle\(block, "authorName"\) \/\* fallback \*\/ \|\| getStyle\(block, "name"\)/g,
  '(Object.keys(getStyle(block, "authorName")).length > 0 ? getStyle(block, "authorName") : getStyle(block, "name"))'
);

blockCode = blockCode.replace(
  /getStyle\(block, "authorTitle"\) \/\* fallback \*\/ \|\| getStyle\(block, "subtitle"\) \|\| getStyle\(block, "role"\)/g,
  '(Object.keys(getStyle(block, "authorTitle")).length > 0 ? getStyle(block, "authorTitle") : (Object.keys(getStyle(block, "subtitle")).length > 0 ? getStyle(block, "subtitle") : getStyle(block, "role")))'
);

code = code.substring(0, startIndex) + blockCode + code.substring(endIndex);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("quote_image fallbacks applied correctly");
