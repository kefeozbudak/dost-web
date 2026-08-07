const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const replacement = `  const getCardStyle = (item: any, block?: any) => {
    if (!item) return {};
    const style: React.CSSProperties = {};
    if (item.cardBgColor || block?.styles?.cardBgColor) style.backgroundColor = item.cardBgColor || block?.styles?.cardBgColor;
    
    const bgImage = item.cardBgImage || block?.styles?.cardBgImage;
    if (bgImage) {
      style.backgroundImage = \`url('\${bgImage}')\`;
      style.backgroundSize = "cover";
      style.backgroundPosition = "center";
      style.backgroundRepeat = "no-repeat";
    }
    
    if (item.cardBorderColor || block?.styles?.cardBorderColor) style.borderColor = item.cardBorderColor || block?.styles?.cardBorderColor;
    if (item.cardBorderWidth || block?.styles?.cardBorderWidth) style.borderWidth = item.cardBorderWidth || block?.styles?.cardBorderWidth;
    return style;
  };`;

code = code.replace(/  const getCardStyle = \(item: any, block\?: any\) => \{[\s\S]*?return style;\n  \};/, replacement);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
