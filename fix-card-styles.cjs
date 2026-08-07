const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const replacement = `  const getCardTitleStyle = (item: any, block: any) => {
    const style = { ...getItemTitleStyle(block) };
    if (item?.itemTitleColor) style.color = item.itemTitleColor;
    return style;
  };

  const getCardDescStyle = (item: any, block: any) => {
    const style = { ...getItemDescStyle(block) };
    if (item?.itemDescColor) style.color = item.itemDescColor;
    return style;
  };

  const getCardButtonStyle = (item: any, block: any) => {
    const style = { ...getItemButtonStyle(block) };
    if (item?.buttonTextColor) style.color = item.buttonTextColor;
    if (item?.buttonBgColor) style.backgroundColor = item.buttonBgColor;
    return style;
  };`;

code = code.replace(/  const getCardTitleStyle = \(item: any, block: any\) => \{[\s\S]*?const getCardButtonStyle = \(item: any, block: any\) => \{[\s\S]*?return \{[\s\S]*?\};\n  \};/m, replacement);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
