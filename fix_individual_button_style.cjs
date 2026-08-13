const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const oldIndividualBtn = `const getIndividualButtonStyle = (btn: any, block?: any) => {
    const style: any = {};`;

const newIndividualBtn = `const getIndividualButtonStyle = (btn: any, block?: any) => {
    const style: any = block ? { ...getButtonStyle(block) } : {};`;

content = content.replace(oldIndividualBtn, newIndividualBtn);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched getIndividualButtonStyle");
