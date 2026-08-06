const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(/backgroundPosition: \(prefix === "" \|\| prefix === "container"\) && block\.styles\?\.backgroundImage \? 'center' : undefined,/g, 
  `backgroundPosition: (prefix === "" || prefix === "container") && block.styles?.backgroundImage ? 'center' : undefined,
      width: block.styles?.fullWidth && (prefix === "" || prefix === "container") ? "100%" : undefined,
      maxWidth: block.styles?.fullWidth && (prefix === "" || prefix === "container") ? "100%" : undefined,`);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Updated getStyle for fullWidth");
