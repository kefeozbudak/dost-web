const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /className=\{getHeroInnerClass\(block, `relative z-10 \$\{block\.styles\?\.textAlign \? "" : "text-center"\} px-gutter max-w-4xl`\)\}>\n                    <h1/,
  `<div className={getHeroInnerClass(block, \`relative z-10 \${block.styles?.textAlign ? "" : "text-center"} px-gutter max-w-4xl\`)}>\n                    <h1`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Fixed clubs");
