const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/const EduSystemLevelsBlock = \(\{[\s\S]*?getSubtitleStyle,\n\}: any\) => \{/, `const EduSystemLevelsBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getCardTitleStyle,
  getCardDescStyle,
}: any) => {`);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
