const fs = require('fs');
const content = fs.readFileSync('src/components/PageBlocks.tsx.bak', 'utf8');
const lines = content.split('\n');

let balance = 0;
let switchStart = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('switch (block.type) {')) {
    switchStart = i;
  }
  if (switchStart !== -1) {
    const openMatches = lines[i].match(/\{/g);
    const closeMatches = lines[i].match(/\}/g);
    if (openMatches) balance += openMatches.length;
    if (closeMatches) balance -= closeMatches.length;
    
    if (balance === 0) {
      console.log(`Switch closed at line: ${i + 1}`);
      break;
    }
  }
}
