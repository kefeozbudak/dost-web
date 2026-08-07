const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(/const EduSystemYadepBlock = \(\{[\s\S]*?getSubtitleStyle,\n\}: any\) => \{/, `const EduSystemYadepBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getCardTitleStyle,
  getCardDescStyle,
}: any) => {`);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
