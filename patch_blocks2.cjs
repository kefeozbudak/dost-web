const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
    /onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*onBlockClick && onBlockClick\(index, e\);\s*\}\}/,
    `onClickCapture={(e) => {
          if (onBlockClick) {
            e.preventDefault();
            e.stopPropagation();
            onBlockClick(index, e);
          }
        }}`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched onClickCapture");
