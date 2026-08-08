const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(
  /<h4 style=\{getStyle\(block, "authorName"\)\} className="font-headline-md text-headline-md text-primary whitespace-pre-line">/g,
  '<h4 style={getCardTitleStyle(block)} className="font-headline-md text-headline-md text-primary whitespace-pre-line">'
);

code = code.replace(
  /<p style=\{getStyle\(block, "authorTitle"\)\} className="text-text-muted whitespace-pre-line">/g,
  '<p style={getCardDescStyle(block)} className="text-text-muted whitespace-pre-line">'
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
