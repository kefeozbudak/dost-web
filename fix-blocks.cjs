const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Replace invalid literal strings we introduced
code = code.replace(/className="([^"]*\$\{getAlignClass\(block\)\}[^"]*)"/g, (match, p1) => {
  return 'className={`' + p1 + '`}'
});

fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("Fixed quotes");
