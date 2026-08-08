const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Update getAlignClass
code = code.replace(
  /export const getAlignClass = \(block: any, defaultClass: string = "mx-auto"\) => \{[\s\S]*?return defaultClass;\n\};\n/,
  `export const getAlignClass = (block: any, fieldKey: string = "", defaultClass: string = "mx-auto") => {
  let align = block?.styles?.textAlign;
  if (fieldKey) {
    align = block?.styles?.[fieldKey + "Align"] || align;
  }
  if (align === "left") return "mr-auto ml-0";
  if (align === "right") return "ml-auto mr-0";
  if (align === "center") return "mx-auto";
  return defaultClass;
};
`
);

// Now we replace \${getAlignClass(block)} with \${getAlignClass(block, "xxx")} based on the style={getXxxStyle(block)}
// This requires looking ahead or behind.
// Since we only have a few, let's just do a manual replace using string manipulation.

const lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('${getAlignClass(block)}')) {
    // Look around for getTitleStyle, getSubtitleStyle, getDescStyle
    let fieldKey = "";
    for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 5); j++) {
      if (lines[j].includes('getTitleStyle')) fieldKey = "title";
      else if (lines[j].includes('getSubtitleStyle')) fieldKey = "subtitle";
      else if (lines[j].includes('getDescStyle')) fieldKey = "desc";
    }
    if (fieldKey) {
      lines[i] = lines[i].replace('${getAlignClass(block)}', `\${getAlignClass(block, "${fieldKey}")}`);
    }
  }
}

fs.writeFileSync('src/components/PageBlocks.tsx', lines.join('\n'));
console.log("Fixed align class params");
