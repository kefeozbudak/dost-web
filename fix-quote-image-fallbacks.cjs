const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// We need to replace the quote_image block text renderings to include fallbacks.
// And also fallback for the styles!

// Find the quote_image block
const startIndex = code.indexOf('case "quote_image":');
if (startIndex === -1) {
  console.log("quote_image block not found");
  process.exit(1);
}

const endIndex = code.indexOf('case "academic_hero":', startIndex);
if (endIndex === -1) {
  console.log("academic_hero block not found");
  process.exit(1);
}

let blockCode = code.substring(startIndex, endIndex);

blockCode = blockCode.replace(
  /\{block\.quote\}/g,
  '{block.quote || block.desc}'
);

blockCode = blockCode.replace(
  /\{block\.authorName\}/g,
  '{block.authorName || block.name}'
);

blockCode = blockCode.replace(
  /\{block\.authorTitle\}/g,
  '{block.authorTitle || block.subtitle || block.role}'
);

// Add style fallbacks
blockCode = blockCode.replace(
  /getStyle\(block, "quote"\)/g,
  'getStyle(block, "quote") /* fallback */ || getStyle(block, "desc")'
);

blockCode = blockCode.replace(
  /getStyle\(block, "authorName"\)/g,
  'getStyle(block, "authorName") /* fallback */ || getStyle(block, "name")'
);

blockCode = blockCode.replace(
  /getStyle\(block, "authorTitle"\)/g,
  'getStyle(block, "authorTitle") /* fallback */ || getStyle(block, "subtitle") || getStyle(block, "role")'
);

code = code.substring(0, startIndex) + blockCode + code.substring(endIndex);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("quote_image fallbacks applied");
