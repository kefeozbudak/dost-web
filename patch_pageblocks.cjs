const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');
content = content.replace(
    "if (btn.bgColor) style.backgroundColor = btn.bgColor;",
    "if (btn.bgColor || btn.cardBgColor) style.backgroundColor = btn.bgColor || btn.cardBgColor;"
);
content = content.replace(
    "if (btn.textColor) style.color = btn.textColor;",
    "if (btn.textColor || btn.cardTextColor) style.color = btn.textColor || btn.cardTextColor;"
);
content = content.replace(
    "if (btn.borderColor) {",
    "if (btn.borderColor || btn.cardBorderColor) {"
);
content = content.replace(
    "style.borderColor = btn.borderColor;",
    "style.borderColor = btn.borderColor || btn.cardBorderColor;"
);
content = content.replace(
    "if (btn.borderRadius) style.borderRadius = btn.borderRadius;",
    "if (btn.borderRadius || btn.cardBorderRadius) style.borderRadius = btn.borderRadius || btn.cardBorderRadius;"
);
fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched PageBlocks.tsx");
