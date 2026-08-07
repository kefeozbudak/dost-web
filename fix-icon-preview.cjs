const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

let newCode = "";
let i = 0;
while (i < code.length) {
  let idx = code.indexOf("<IconPreview", i);
  if (idx === -1) {
    newCode += code.substring(i);
    break;
  }
  newCode += code.substring(i, idx);
  let endIdx = code.indexOf("/>", idx);
  let tag = code.substring(idx, endIdx + 2);
  
  let dataMatch = tag.match(/data=\{([a-zA-Z0-9_]+)\.icon/);
  let itemVar = "null";
  if (dataMatch) {
    itemVar = dataMatch[1]; // item, btn, etc.
  }
  
  if (tag.includes("style={{")) {
    tag = tag.replace(/style=\{\{\s*/, `style={{ ...getIconStyle(${itemVar}, block), `);
  } else {
    tag = tag.replace("/>", ` style={getIconStyle(${itemVar}, block)} />`);
  }
  
  newCode += tag;
  i = endIdx + 2;
}

fs.writeFileSync('src/components/PageBlocks.tsx', newCode);
