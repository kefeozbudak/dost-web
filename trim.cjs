const fs = require('fs');
let content = fs.readFileSync('src/lib/styleUtils.ts', 'utf-8');

const str = "    const opacityValue = block.styles?.overlayOpacity";
const idx = content.indexOf(str);

if (idx !== -1) {
  content = content.substring(0, idx);
  fs.writeFileSync('src/lib/styleUtils.ts', content);
  console.log("Trimmed successfully");
} else {
  console.log("Not found");
}
