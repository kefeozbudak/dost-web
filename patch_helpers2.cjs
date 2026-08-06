const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const helpers = `
export const getHeroAlignStyle = (block: any): React.CSSProperties => {
  if (!block.type || !block.type.includes('hero')) return {};
  const alignY = block.styles?.heroAlignY;
  const style: React.CSSProperties = {};
  
  if (alignY === 'top') {
    style.justifyContent = 'flex-start';
    style.alignItems = 'flex-start'; // for flex-row
  } else if (alignY === 'bottom') {
    style.justifyContent = 'flex-end';
    style.alignItems = 'flex-end'; // for flex-row
  } else if (alignY === 'center') {
    style.justifyContent = 'center';
    style.alignItems = 'center';
  }
  return style;
};

export const getHeroInnerClass = (block: any, defaultClasses: string = '') => {
  if (!block.type || !block.type.includes('hero')) return defaultClasses;
  const alignX = block.styles?.heroAlignX;
  let alignClass = '';
  if (alignX === 'center') alignClass = 'mx-auto text-center items-center';
  else if (alignX === 'right') alignClass = 'ml-auto text-right items-end';
  else if (alignX === 'left') alignClass = 'mr-auto text-left items-start';
  
  // ensure it's a flex column so items-start/end aligns the buttons
  if (alignClass && !defaultClasses.includes('flex-col')) {
    alignClass = 'flex flex-col ' + alignClass;
  }
  
  return \`\${defaultClasses} \${alignClass}\`.trim();
};
`;

if (!content.includes('getHeroAlignStyle')) {
  // Insert at the top after imports
  content = content.replace(/(import .*?\n)+/, (match) => match + '\n' + helpers + '\n');
  fs.writeFileSync('src/components/PageBlocks.tsx', content);
  console.log("Added helpers at the top.");
} else {
  console.log("Helpers already exist.");
}
