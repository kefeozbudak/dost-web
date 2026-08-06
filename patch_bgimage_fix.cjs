const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /      backgroundImage: \(prefix === "container" \|\| prefix === ""\) && block\.styles\?\.backgroundImage \? `url\(\\\$\\{block\.styles\.backgroundImage\\}\)` : undefined,\n      backgroundSize: \(prefix === "container" \|\| prefix === ""\) && block\.styles\?\.backgroundImage \? "cover" : undefined,\n      backgroundPosition: \(prefix === "container" \|\| prefix === ""\) && block\.styles\?\.backgroundImage \? "center" : undefined,\n      backgroundRepeat: \(prefix === "container" \|\| prefix === ""\) && block\.styles\?\.backgroundImage \? "no-repeat" : undefined,\n/g,
  ''
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Fixed duplicate keys in PageBlocks.tsx");
