const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

if (!code.includes('export const getAlignClass')) {
  const insertPos = code.indexOf('export const getHeroInnerClass');
  const helper = `export const getAlignClass = (block: any, defaultClass: string = "mx-auto") => {
  if (!block?.styles?.textAlign) return defaultClass;
  if (block.styles.textAlign === "left") return "mr-auto ml-0";
  if (block.styles.textAlign === "right") return "ml-auto mr-0";
  return defaultClass;
};

`;
  code = code.slice(0, insertPos) + helper + code.slice(insertPos);
}

// Now we need to replace mx-auto with \${getAlignClass(block)} in classNames.
// This is a bit tricky to do with regex because mx-auto could be in normal string or template literal.
// Let's do it safely by just looking at the specific HeroBlocks and standard hero block.
fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("Added getAlignClass");
