const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');
const lines = code.split('\n');

const startIndex = lines.findIndex(line => line.includes('case "edu_system_levels":'));
console.log(lines.slice(startIndex, startIndex + 20).join('\n'));
