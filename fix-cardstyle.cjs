const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const replacement = `  const getCardStyle = (item: any, block?: any) => {
    if (!item) return {};
    const style: React.CSSProperties = {};
    if (item.cardBgColor || block?.styles?.cardBgColor) style.backgroundColor = item.cardBgColor || block?.styles?.cardBgColor;
    if (item.cardBorderColor || block?.styles?.cardBorderColor) style.borderColor = item.cardBorderColor || block?.styles?.cardBorderColor;
    if (item.cardBorderWidth || block?.styles?.cardBorderWidth) style.borderWidth = item.cardBorderWidth || block?.styles?.cardBorderWidth;
    return style;
  };`;

code = code.replace(/  const getCardStyle = \(item: any\) => \{[\s\S]*?return style;\n  \};/, replacement);

code = code.replace(/getCardStyle\(item\)/g, 'getCardStyle(item, block)');
code = code.replace(/getCardStyle\(legend\)/g, 'getCardStyle(legend, block)');

fs.writeFileSync('src/components/PageBlocks.tsx', code);
