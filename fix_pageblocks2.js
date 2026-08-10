import fs from 'fs';

let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const heroBlocks = [
  'middle_school_hero',
  'high_school_hero'
];

for (const hero of heroBlocks) {
  const casePattern = new RegExp(`if \\(block.type === "${hero}"\\) \\{([\\s\\S]*?)\\}`, 'g');
  let match;
  while ((match = casePattern.exec(content)) !== null) {
    let heroContent = match[1];
    
    // Find the h1's style
    const h1Pattern = /className="font-display-lg text-display-lg text-on-[a-zA-Z-]+ mb-6 leading-tight whitespace-pre-line"\s+style=\{getTitleStyle\(block\)\}/g;
    heroContent = heroContent.replace(h1Pattern, `className="font-display-lg text-display-lg text-on-surface mb-6 leading-tight whitespace-pre-line"\n                style={{ ...getTitleStyle(block), color: block.styles?.titlePart1Color || block.styles?.titleColor || undefined }}`);

    // Wait, let's use a simpler regex for the H1 if it differs
    const genericH1 = /className="([^"]+)"\s+style=\{getTitleStyle\(block\)\}/g;
    heroContent = heroContent.replace(genericH1, `className="$1"\n                style={{ ...getTitleStyle(block), color: block.styles?.titlePart1Color || block.styles?.titleColor || undefined }}`);

    const p2Pattern = /style=\{\{ color: block\.titlePart2Color \|\| undefined \}\}/g;
    heroContent = heroContent.replace(p2Pattern, `style={{ color: block.styles?.titlePart2Color || block.titlePart2Color || undefined }}`);
    
    content = content.replace(match[1], heroContent);
    console.log("Fixed PageBlocks for " + hero);
  }
}

fs.writeFileSync('src/components/PageBlocks.tsx', content);
