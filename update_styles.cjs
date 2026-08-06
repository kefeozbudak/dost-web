const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(/const getTitleStyle = \(block: any\) => getStyle\(block, "title"\);/g, 
  'const getTitleStyle = (block: any) => ({ ...getStyle(block, "title"), whiteSpace: "pre-line" as const });');

content = content.replace(/const getSubtitleStyle = \(block: any\) => getStyle\(block, "subtitle"\);/g, 
  'const getSubtitleStyle = (block: any) => ({ ...getStyle(block, "subtitle"), whiteSpace: "pre-line" as const });');

content = content.replace(/const getItemTitleStyle = \(block: any\) => getStyle\(block, "itemTitle"\);/g, 
  'const getItemTitleStyle = (block: any) => ({ ...getStyle(block, "itemTitle"), whiteSpace: "pre-line" as const });');

content = content.replace(/const getItemDescStyle = \(block: any\) => getStyle\(block, "itemDesc"\);/g, 
  'const getItemDescStyle = (block: any) => ({ ...getStyle(block, "itemDesc"), whiteSpace: "pre-line" as const });');

content = content.replace(/const getTitlePart1Style = \(block: any\) => \(\{/g, 
  'const getTitlePart1Style = (block: any) => ({\n    whiteSpace: "pre-line" as const,');

content = content.replace(/const getTitlePart2Style = \(block: any\) => \(\{/g, 
  'const getTitlePart2Style = (block: any) => ({\n    whiteSpace: "pre-line" as const,');

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Updated styles with whiteSpace");
