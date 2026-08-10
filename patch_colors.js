import fs from 'fs';
let pb = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

pb = pb.replace(
  /color: block\.styles\?\.titlePart1Color \|\| block\.titlePart1Color \|\| undefined,/g,
  'color: block.styles?.titlePart1Color || block.styles?.titleColor || block.titlePart1Color || block.titleColor || undefined,'
);

pb = pb.replace(
  /color: block\.styles\?\.titlePart2Color \|\| block\.titlePart2Color \|\| undefined,/g,
  'color: block.styles?.titlePart2Color || block.styles?.titleColor || block.titlePart2Color || block.titleColor || undefined,'
);

fs.writeFileSync('src/components/PageBlocks.tsx', pb);
