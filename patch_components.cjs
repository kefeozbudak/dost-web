const fs = require('fs');
const files = [
  'src/components/PageBlocks.tsx',
  'src/components/SchoolBlocks.tsx',
  'src/components/AboutBlocks.tsx',
  'src/components/ManagementBlocks.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (!content.includes('getHeroOverlayClass')) {
    content = content.replace('import {', 'import {\n  getHeroOverlayClass,');
    fs.writeFileSync(file, content);
  }
}
console.log("Imports added");
