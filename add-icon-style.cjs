const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(
  /const getCardButtonStyle = \(item: any, block: any\) => \{/,
  `const getIconStyle = (item: any, block: any, prefix = "icon") => {
    const style: React.CSSProperties = { ...getStyle(block, prefix) };
    if (item?.iconColor) style.color = item.iconColor;
    return style;
  };

  const getCardButtonStyle = (item: any, block: any) => {`
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
