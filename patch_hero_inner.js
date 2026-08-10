import fs from 'fs';
const file = 'src/components/PageBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `export const getHeroInnerClass = (block: any, defaultClasses: string = "") => {
  if (!block.type || !block.type.includes("hero")) return defaultClasses;
  const alignX = block.styles?.heroAlignX || block.styles?.textAlign;
  let alignClass = "";
  if (alignX === "center") alignClass = "mx-auto text-center items-center";
  else if (alignX === "right") alignClass = "ml-auto text-right items-end";
  else if (alignX === "left") alignClass = "mr-auto text-left items-start";

  let cleanedClasses = defaultClasses;
  if (alignClass) {
    cleanedClasses = cleanedClasses.replace(/\\bmx-auto\\b/g, '')
                                   .replace(/\\bml-auto\\b/g, '')
                                   .replace(/\\bmr-auto\\b/g, '')
                                   .replace(/\\btext-center\\b/g, '')
                                   .replace(/\\btext-left\\b/g, '')
                                   .replace(/\\btext-right\\b/g, '');
    if (!cleanedClasses.includes("flex-col")) {
      alignClass = "flex flex-col " + alignClass;
    }
  }

  return \`\${cleanedClasses} \${alignClass}\`.trim().replace(/\\s+/g, ' ');
};`;

content = content.replace(/export const getHeroInnerClass = \([\s\S]*?return \`\$\{defaultClasses\} \$\{alignClass\}\`\.trim\(\);\n\};\n/m, replacement + '\n');

fs.writeFileSync(file, content);
console.log("Patched getHeroInnerClass");
