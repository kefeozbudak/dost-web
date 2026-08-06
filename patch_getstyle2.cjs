const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /if \(prefix === 'button' && block\.styles\?\.buttonColor\)/,
  `if (prefix === "container" && block.type && block.type.includes("hero")) {
    const heroStyle = getHeroAlignStyle(block);
    Object.assign(style, heroStyle);
    if (block.styles?.heroAlignY) {
      style.display = "flex";
    }
  }

  if (prefix === 'button' && block.styles?.buttonColor)`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Updated getStyle.");
