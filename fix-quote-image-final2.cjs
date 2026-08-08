const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(
  /style=\{getSubtitleStyle\(block\)\}\n\s*className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line"/g,
  'style={{...getStyle(block, "quote"), whiteSpace: "pre-line"}}\n                        className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line"'
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
