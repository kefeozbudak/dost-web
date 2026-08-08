const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Fix subtitle -> quote
code = code.replace(
  /<p\s*style=\{getSubtitleStyle\(block\)\}\s*className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line">/g,
  '<p style={{...getStyle(block, "quote"), whiteSpace: "pre-line"}} className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line">'
);

// Fix authorName
code = code.replace(
  /<h4 style=\{getCardTitleStyle\(block\)\} className="font-headline-md text-headline-md text-primary whitespace-pre-line">/g,
  '<h4 style={{...getStyle(block, "authorName"), whiteSpace: "pre-line"}} className="font-headline-md text-headline-md text-primary whitespace-pre-line">'
);

// Fix authorTitle
code = code.replace(
  /<p style=\{getCardDescStyle\(block\)\} className="text-text-muted whitespace-pre-line">/g,
  '<p style={{...getStyle(block, "authorTitle"), whiteSpace: "pre-line"}} className="text-text-muted whitespace-pre-line">'
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
