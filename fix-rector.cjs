const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const startIndex = code.indexOf('case "management_rector":');
const endIndex = code.indexOf('case "management_vice_rectors":', startIndex);
let blockCode = code.substring(startIndex, endIndex);

blockCode = blockCode.replace(
  /\{block\.badge \|\| "Rektörlük Makamı"\}/g,
  '{getValidText(block.badge, "Rektörlük Makamı")}'
);

blockCode = blockCode.replace(
  /\{block\.name \|\| "Prof\. Dr\. Ahmet Yılmaz"\}/g,
  '<span dangerouslySetInnerHTML={{ __html: getValidText(block.name, "Prof. Dr. Ahmet Yılmaz") }} />'
);

blockCode = blockCode.replace(
  /\{block\.role \|\| "Rektör"\}/g,
  '<span dangerouslySetInnerHTML={{ __html: getValidText(block.role, "Rektör") }} />'
);

blockCode = blockCode.replace(
  /dangerouslySetInnerHTML=\{\{ __html: block\.quote \|\| "" \}\}/g,
  'dangerouslySetInnerHTML={{ __html: getValidText(block.quote, "Lütfen admin panelinden Alıntı (Söz) alanını doldurun.") }}'
);

code = code.substring(0, startIndex) + blockCode + code.substring(endIndex);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("management_rector updated with robust whitespace fallback");
