const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  'const getIndividualButtonStyle = (btn: any) => {',
  'const getIndividualButtonStyle = (btn: any, block?: any) => {'
);
content = content.replace(
  'const style: any = {};',
  'const style: any = block ? { ...getButtonStyle(block) } : {};'
);

content = content.replace(/getIndividualButtonStyle\(btn\)/g, 'getIndividualButtonStyle(btn, block)');

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched getIndividualButtonStyle");
