const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/const EduSystemPhilosophyBlock = \(\{[\s\S]*?getSubtitleStyle,\n\}: any\) => \{/, `const EduSystemPhilosophyBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getCardTitleStyle,
  getCardDescStyle,
}: any) => {`);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
