const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
    /if \(item\.cardBorderWidth \|\| block\?\.styles\?\.cardBorderWidth\) style\.borderWidth = item\.cardBorderWidth \|\| block\?\.styles\?\.cardBorderWidth;/g,
    `if (item.cardBorderWidth || block?.styles?.cardBorderWidth) style.borderWidth = item.cardBorderWidth || block?.styles?.cardBorderWidth;
    if (item.cardBorderRadius || block?.styles?.cardBorderRadius) style.borderRadius = item.cardBorderRadius || block?.styles?.cardBorderRadius;
    if (item.cardPadding || block?.styles?.cardPadding) style.padding = item.cardPadding || block?.styles?.cardPadding;`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched getCardStyle");
