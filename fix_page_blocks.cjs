const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// I will insert the import at the top
content = content.replace(
  'import { ManagementHeroBlock, ManagementRectorBlock, ManagementTeamGridBlock } from \'./ManagementBlocks\';',
  'import { getStyle, getTitleStyle, getSubtitleStyle, getDescStyle, getBadgeStyle, getButtonStyle, getItemContainerStyle, getItemTitleStyle, getItemDescStyle, getItemButtonStyle, getTitlePart1Style, getTitlePart2Style, getValidText, getValidStyle, getIndividualButtonStyle, fallbackImages, getImageStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, extractAlignClass, removeAlignStyles, getIconStyle, getCardButtonStyle } from "../lib/styleUtils";\nimport { ManagementHeroBlock, ManagementRectorBlock, ManagementTeamGridBlock } from \'./ManagementBlocks\';'
);

// Now I need to delete the local declarations from DynamicBlockRenderer
// It starts with `const getStyle = (block: any, prefix: string) => {`
// and ends right before `const renderBlock = (block: any, index: number) => {`

const startIdx = content.indexOf('  const getStyle = (block: any, prefix: string) => {');
const endIdx = content.indexOf('  const renderBlock = (block: any, index: number) => {');

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + content.substring(endIdx);
}

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched PageBlocks.tsx");
