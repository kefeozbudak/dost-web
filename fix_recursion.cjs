const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// The incorrect getStyle
const oldGetStyle = `  const getStyle = (block: any, prefix: string) => {
    const style: any = block ? { ...getButtonStyle(block) } : {};`;
const newGetStyle = `  const getStyle = (block: any, prefix: string) => {
    const style: any = {};`;

content = content.replace(oldGetStyle, newGetStyle);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched getStyle");
