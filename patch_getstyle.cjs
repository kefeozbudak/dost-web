const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /const getStyle = \(block: any, prefix: string\) => \{\n\s*return \{\n\s*color: block\.styles\?\.\[prefix \+ "Color"\] \|\| undefined,/g,
  `const getStyle = (block: any, prefix: string) => {\n    return {\n      color: block.styles?.[prefix + "Color"] || (prefix === "container" || prefix === "" ? block.styles?.color : undefined) || undefined,`
);

content = content.replace(
  /backgroundColor:\n\s*\(prefix === "" \? block\.styles\?\.backgroundColor : undefined\) \|\|\n\s*block\.styles\?\.\[prefix \+ "BackgroundColor"\] \|\|\n\s*undefined,/g,
  `backgroundColor:\n        block.styles?.[prefix + "BackgroundColor"] ||\n        ((prefix === "container" || prefix === "") ? block.styles?.backgroundColor : undefined) ||\n        undefined,`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched getStyle in PageBlocks.tsx");
