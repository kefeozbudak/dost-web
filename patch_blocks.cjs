const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
    '        onClick={(e) => {\\n          e.stopPropagation();\\n          onBlockClick && onBlockClick(index, e);\\n        }}',
    '        onClickCapture={(e) => {\\n          if (onBlockClick) {\\n            e.preventDefault();\\n            e.stopPropagation();\\n            onBlockClick(index, e);\\n          }\\n        }}'
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched onClickCapture");
