const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Find the getIndividualButtonStyle
const targetStr = `const getValidStyle = (block: any, ...keys: string[]) => {
  for (const key of keys) {
    const s = getStyle(block, key);
    if (Object.keys(s).length > 0) return s;
  }
  return {};
const getIndividualButtonStyle = (btn: any) => {
    const style: any = {};


};`;

if (code.includes(targetStr)) {
    code = code.replace(targetStr, `const getValidStyle = (block: any, ...keys: string[]) => {
  for (const key of keys) {
    const s = getStyle(block, key);
    if (Object.keys(s).length > 0) return s;
  }
  return {};
};

const getIndividualButtonStyle = (btn: any) => {
    const style: any = {};`);
    fs.writeFileSync('src/components/PageBlocks.tsx', code);
    console.log("Fixed syntax error");
} else {
    console.log("Syntax error target not found");
}
