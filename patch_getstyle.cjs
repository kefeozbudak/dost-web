const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /if \(prefix === 'button' && block\.styles\?\.buttonColor\)/,
  `if (prefix === "container" && block.type && block.type.includes("hero")) {
    const heroStyle = getHeroAlignStyle(block);
    Object.assign(style, heroStyle);
    // Force flex display if vertical alignment is set so it works everywhere
    if (block.styles?.heroAlignY) {
      style.display = "flex";
      // We don't force flex-direction here because some heroes use flex-row (like campus_hero) and some use flex-col.
      // But we set both alignItems and justifyContent in getHeroAlignStyle so it should handle both.
    }
  }

  if (prefix === 'button' && block.styles?.buttonColor)`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Updated getStyle.");
