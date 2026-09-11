const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  /if \(day\.isWeekend\) \{/g,
  "if (day.isWeekend && !day.isToday) {"
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
