const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// We need to inject a helper to determine the flex alignment based on titleAlign
code = code.replace(
  'const isStacked =',
  `const titleAlign = block.styles?.titleAlign || block.styles?.textAlign || "center";
                        const flexAlign = titleAlign === "left" ? "items-start justify-start text-left" : titleAlign === "right" ? "items-end justify-end text-right" : "items-center justify-center text-center";
                        const isStacked =`
);

// Now replace the hardcoded "items-center justify-center" with flexAlign
// Wait, the block is:
/*
                                isStacked
                                  ? "flex flex-col items-center justify-center gap-1 md:gap-2"
                                  : "flex flex-wrap items-center justify-center gap-x-3 md:gap-x-4 gap-y-1"
*/
// It occurs only once in the hero block for hasPart1 || hasPart2. Let's do a precise replace.

const searchStr = `isStacked
                                  ? "flex flex-col items-center justify-center gap-1 md:gap-2"
                                  : "flex flex-wrap items-center justify-center gap-x-3 md:gap-x-4 gap-y-1"`;

const replaceStr = `isStacked
                                  ? \`flex flex-col gap-1 md:gap-2 \${flexAlign}\`
                                  : \`flex flex-wrap gap-x-3 md:gap-x-4 gap-y-1 \${flexAlign}\``;

if (code.includes(searchStr)) {
  code = code.replace(searchStr, replaceStr);
  fs.writeFileSync('src/components/PageBlocks.tsx', code);
  console.log("Fixed stacked align");
} else {
  console.log("Could not find search string");
}
