const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /className=\{`space-y-6 \$\{block\.styles\?\.textAlign \? "" : "text-center"\} mx-auto`\}/,
  'className={getHeroInnerClass(block, `space-y-6 ${block.styles?.textAlign ? "" : "text-center"} mx-auto`)}'
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched achievements hero");
