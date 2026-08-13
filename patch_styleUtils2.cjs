const fs = require('fs');
const file = 'src/lib/styleUtils.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /style\.borderRadius = block\.styles\?\.\[prefix \+ "BorderRadius"\] \? block\.styles\[prefix \+ "BorderRadius"\] \+ "px" : undefined;/g,
  `style.borderRadius = block.styles?.[prefix + "BorderRadius"] ? String(block.styles[prefix + "BorderRadius"]).replace(/px/g, '') + "px" : undefined;`
);

fs.writeFileSync(file, content);
console.log("Patched BorderRadius in styleUtils.ts");
