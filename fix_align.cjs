const fs = require('fs');

let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// The internal p text has its own explicit getAlignClass
content = content.replace(
  'className={`text-body-lg text-primary-fixed max-w-xl ${getAlignClass(block)} whitespace-pre-line`}',
  'className={`text-body-lg text-primary-fixed max-w-xl whitespace-pre-line`}'
);

// The buttons container has explicit justify-center
content = content.replace(
  'className="flex gap-4 pt-4 justify-center whitespace-pre-line"',
  'className="flex gap-4 pt-4 whitespace-pre-line"'
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Fixed internal alignment hardcodes in achievements_hero");
