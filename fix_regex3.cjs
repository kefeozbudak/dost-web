const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(/\.split\(\/\[,\\n\]\+\/\)\\n\]\+\//g, '.split(/[,\\n]+/)');
fs.writeFileSync('src/components/PageBlocks.tsx', content);
