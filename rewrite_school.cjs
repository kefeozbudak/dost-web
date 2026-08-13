const fs = require('fs');

const file = 'src/components/SchoolBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure import is there
if (!content.includes('styleUtils')) {
  content = `import { getStyle, getTitleStyle, getSubtitleStyle, getIconStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, getItemButtonStyle, getIndividualButtonStyle } from "../lib/styleUtils";\n` + content;
} else if (!content.includes('getIndividualButtonStyle')) {
  content = content.replace(
    'import { getStyle, getTitleStyle, getSubtitleStyle, getIconStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, getItemButtonStyle } from "../lib/styleUtils";',
    'import { getStyle, getTitleStyle, getSubtitleStyle, getIconStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, getItemButtonStyle, getIndividualButtonStyle } from "../lib/styleUtils";'
  );
}

// For SchoolHeroBlock
content = content.replace(
  /const btnStyle = {[^}]*};/g,
  'const btnStyle = getIndividualButtonStyle(btn, block);'
);

fs.writeFileSync(file, content);
console.log("Patched SchoolBlocks");
