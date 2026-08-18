const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(
  /data-editor-item-index=\{day\._oIndex !== undefined && day\._oIndex !== -1 \? day\._oIndex : undefined\}/g,
  `data-editor-item-index={day._oIndex !== undefined && day._oIndex !== -1 ? day._oIndex : (parseInt(day.date)-1)}\n                            data-editor-array-key="days"`
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
