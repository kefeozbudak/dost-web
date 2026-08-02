const fs = require('fs');
const code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

let diff = 0;
let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
        if (lines[i][j] === '{') diff++;
        else if (lines[i][j] === '}') diff--;
        if (diff < 0) {
            console.log(`Negative diff at line ${i+1}: ${lines[i]}`);
            process.exit(0);
        }
    }
}
console.log('Final diff:', diff);
