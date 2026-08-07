const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const lines = code.split('\n');
console.log(JSON.stringify(lines.slice(2913, 2920)));
