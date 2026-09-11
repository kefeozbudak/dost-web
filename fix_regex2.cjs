const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(/\.split\(\/\[,\n\]\+\/\)/g, '.split(/[,\\n]+/)');
// or maybe it's just a raw newline character between [, and ]
let idx = content.indexOf('.split(/[,');
if (idx > -1) {
  let sub = content.substring(idx, idx + 20);
  console.log("Found:", JSON.stringify(sub));
}
