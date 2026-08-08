const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const matches = [...code.matchAll(/<div[^>]*>\s*<input\s+type="color"[^>]*>[\s\S]*?<\/div>/g)];
let colorInputsCount = 0;
for (let match of matches) {
  if (match[0].includes('type="text"')) {
    colorInputsCount++;
  }
}
console.log("Color inputs with text:", colorInputsCount);

// Let's see how many `type="color"` exist in total.
const totalColor = [...code.matchAll(/type="color"/g)].length;
console.log("Total type=color:", totalColor);
