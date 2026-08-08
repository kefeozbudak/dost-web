const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

function replaceInBlock(startStr, endStr) {
  const start = code.indexOf(startStr);
  if (start === -1) return;
  const end = code.indexOf(endStr, start);
  if (end === -1) return;
  
  let chunk = code.substring(start, end);
  // Replace max-w-2xl mx-auto
  chunk = chunk.replace(/max-w-2xl mx-auto/g, 'max-w-2xl ${getAlignClass(block)}');
  // Replace max-w-3xl mx-auto
  chunk = chunk.replace(/max-w-3xl mx-auto/g, 'max-w-3xl ${getAlignClass(block)}');
  // Replace max-w-4xl mx-auto
  chunk = chunk.replace(/max-w-4xl mx-auto/g, 'max-w-4xl ${getAlignClass(block)}');
  
  code = code.substring(0, start) + chunk + code.substring(end);
}

replaceInBlock('const EduSystemHeroBlock = (', '};');
replaceInBlock('const CareerHeroBlock = (', '};');
replaceInBlock('const BurslulukHeroBlock = (', '};');
replaceInBlock('case "hero":', 'case "services":');
// What about other hero types? 
// Let's check them.
fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("Fixed mx-auto safely");
