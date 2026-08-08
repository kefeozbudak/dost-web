const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(
  /className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line w-full md:w-auto"/g,
  'className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line"'
);

code = code.replace(
  /className="font-headline-md text-headline-md text-primary whitespace-pre-line w-full md:w-auto"/g,
  'className="font-headline-md text-headline-md text-primary whitespace-pre-line"'
);

code = code.replace(
  /className="text-text-muted whitespace-pre-line w-full md:w-auto"/g,
  'className="text-text-muted whitespace-pre-line"'
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
