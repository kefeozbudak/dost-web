const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
    /const isCustom =\s*btn\.bgColor \|\|\s*btn\.textColor \|\|\s*btn\.borderColor \|\|\s*btn\.borderRadius;/g,
    `const isCustom = btn.bgColor || btn.textColor || btn.borderColor || btn.borderRadius || btn.cardBgColor || btn.cardTextColor || btn.cardBorderColor || btn.cardBorderRadius;`
);

content = content.replace(
    /const isCustomColors = btn\.bgColor \|\| btn\.textColor;/g,
    `const isCustomColors = btn.bgColor || btn.textColor || btn.cardBgColor || btn.cardTextColor;`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched isCustom");
