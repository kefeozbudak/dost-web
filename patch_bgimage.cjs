const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /backgroundColor:\n\s*block\.styles\?\.\[prefix \+ "BackgroundColor"\] \|\|\n\s*\(\(prefix === "container" \|\| prefix === ""\) \? block\.styles\?\.backgroundColor : undefined\) \|\|\n\s*undefined,/,
  `backgroundColor:\n        block.styles?.[prefix + "BackgroundColor"] ||\n        ((prefix === "container" || prefix === "") ? block.styles?.backgroundColor : undefined) ||\n        undefined,\n      backgroundImage: (prefix === "container" || prefix === "") && block.styles?.backgroundImage ? \`url(\${block.styles.backgroundImage})\` : undefined,\n      backgroundSize: (prefix === "container" || prefix === "") && block.styles?.backgroundImage ? "cover" : undefined,\n      backgroundPosition: (prefix === "container" || prefix === "") && block.styles?.backgroundImage ? "center" : undefined,\n      backgroundRepeat: (prefix === "container" || prefix === "") && block.styles?.backgroundImage ? "no-repeat" : undefined,`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched backgroundImage in PageBlocks.tsx");
