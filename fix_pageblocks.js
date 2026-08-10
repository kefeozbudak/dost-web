import fs from 'fs';

let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// We need to replace: style={getTitleStyle(block)}
// inside the h1 tag for the 4 hero blocks, to include titlePart1Color if available.

const heroBlocks = [
  'kindergarten_hero',
  'primary_school_hero',
  'middle_school_hero',
  'high_school_hero'
];

for (const hero of heroBlocks) {
  // Let's find the case for the hero
  const casePattern = new RegExp(`case "${hero}":([\\s\\S]*?)case "`);
  const match = content.match(casePattern);
  if (match) {
    let heroContent = match[1];
    
    // Find the h1's style
    const h1Pattern = /className="font-display-lg text-display-lg text-on-background whitespace-pre-line"\s+style=\{getTitleStyle\(block\)\}/g;
    
    heroContent = heroContent.replace(h1Pattern, `className="font-display-lg text-display-lg text-on-background whitespace-pre-line"\n                    style={{ ...getTitleStyle(block), color: block.styles?.titlePart1Color || block.styles?.titleColor || undefined }}`);
    
    // We also need to fix titlePart2 color to read from block.styles
    // style={{ color: block.titlePart2Color || undefined }}
    // change to: style={{ color: block.styles?.titlePart2Color || block.titlePart2Color || undefined }}
    const p2Pattern = /style=\{\{ color: block\.titlePart2Color \|\| undefined \}\}/g;
    heroContent = heroContent.replace(p2Pattern, `style={{ color: block.styles?.titlePart2Color || block.titlePart2Color || undefined }}`);
    
    content = content.replace(match[1], heroContent);
    console.log("Fixed PageBlocks for " + hero);
  }
}

fs.writeFileSync('src/components/PageBlocks.tsx', content);
