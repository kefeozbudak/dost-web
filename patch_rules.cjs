const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(
  /\(item\.rules \|\| item\.desc \|\| \[\]\)\.map\(/g,
  `(Array.isArray(item.rules || item.desc || []) ? (item.rules || item.desc || []) : (item.rules || item.desc || '').split('\\n')).map(`
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("Patched rules rendering");
