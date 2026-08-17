const fs = require('fs');
let content = fs.readFileSync('src/lib/styleUtils.ts', 'utf-8');

const idx = content.lastIndexOf("    const opacityValue =");

if (idx !== -1) {
  content = content.substring(0, idx);
  fs.writeFileSync('src/lib/styleUtils.ts', content);
  console.log("Trimmed");
} else {
  console.log("Not found again");
}
