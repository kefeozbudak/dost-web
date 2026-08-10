import fs from 'fs';
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Primary School
content = content.replace(
  /className="font-display-lg text-display-lg text-on-surface whitespace-pre-line"\s+style=\{getTitleStyle\(block\)\}/,
  `className="font-display-lg text-display-lg text-on-surface whitespace-pre-line"\n                    style={{ ...getTitleStyle(block), color: block.styles?.titlePart1Color || block.styles?.titleColor || undefined }}`
);

// Middle School
content = content.replace(
  /className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight whitespace-pre-line"\s+style=\{getTitleStyle\(block\)\}/,
  `className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight whitespace-pre-line"\n                style={{ ...getTitleStyle(block), color: block.styles?.titlePart1Color || block.styles?.titleColor || undefined }}`
);
content = content.replace(
  /style=\{\{ color: block\.titlePart2Color \|\| undefined \}\}/g,
  `style={{ color: block.styles?.titlePart2Color || block.titlePart2Color || undefined }}`
);

// High School
content = content.replace(
  /className="font-display-lg text-display-lg text-main whitespace-pre-line"\s+style=\{getTitleStyle\(block\)\}/,
  `className="font-display-lg text-display-lg text-main whitespace-pre-line"\n                  style={{ ...getTitleStyle(block), color: block.styles?.titlePart1Color || block.styles?.titleColor || undefined }}`
);
content = content.replace(
  /color: block\.titlePart2Color \|\| undefined,/g,
  `color: block.styles?.titlePart2Color || block.titlePart2Color || undefined,`
);
content = content.replace(
  /WebkitTextFillColor: block\.titlePart2Color/g,
  `WebkitTextFillColor: (block.styles?.titlePart2Color || block.titlePart2Color)`
);
content = content.replace(
  /backgroundImage: block\.titlePart2Color/g,
  `backgroundImage: (block.styles?.titlePart2Color || block.titlePart2Color)`
);


fs.writeFileSync('src/components/PageBlocks.tsx', content);
