const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(/className="\{getHeroInnerClass([^}]*)\}"/g, (match, p1) => {
  return "className={getHeroInnerClass" + p1 + "}";
});

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Fixed quotes");
