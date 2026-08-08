const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const startIndex = code.indexOf('case "quote_image":');
const endIndex = code.indexOf('case "academic_hero":', startIndex);
let blockCode = code.substring(startIndex, endIndex);

// Replace inner card div
blockCode = blockCode.replace(
  /<div className="bg-surface-card rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl whitespace-pre-line">/,
  `<div className="rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl whitespace-pre-line" style={{ backgroundColor: block.styles?.containerBackgroundColor || 'var(--color-surface-card)' }}>`
);

// Replace quote p
blockCode = blockCode.replace(
  /<p\s*style=\{\{\.\.\.\(Object\.keys\(getStyle\(block, "quote"\)\)\.length > 0 \? getStyle\(block, "quote"\) : getStyle\(block, "desc"\)\), whiteSpace: "pre-line"\}\}\s*className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line"\s*>\s*\{block\.quote \|\| block\.desc\}\s*<\/p>/,
  `<div
                        style={{...(Object.keys(getStyle(block, "quote")).length > 0 ? getStyle(block, "quote") : getStyle(block, "desc")), whiteSpace: "pre-line"}}
                        className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: block.quote || block.desc || '<span style="color:red">Lütfen admin panelinden Alıntı Metni (Quote) alanını doldurun.</span>' }}
                      />`
);

// Replace authorName h4
blockCode = blockCode.replace(
  /<h4 style=\{\{\.\.\.\(Object\.keys\(getStyle\(block, "authorName"\)\)\.length > 0 \? getStyle\(block, "authorName"\) : getStyle\(block, "name"\)\), whiteSpace: "pre-line"\}\} className="font-headline-md text-headline-md text-primary whitespace-pre-line">\s*\{block\.authorName \|\| block\.name\}\s*<\/h4>/,
  `<h4 style={{...(Object.keys(getStyle(block, "authorName")).length > 0 ? getStyle(block, "authorName") : getStyle(block, "name")), whiteSpace: "pre-line"}} className="font-headline-md text-headline-md text-primary whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.authorName || block.name || '<span style="color:red">Yazar Adı eksik</span>' }} />`
);

// Replace authorTitle p
blockCode = blockCode.replace(
  /<p style=\{\{\.\.\.\(Object\.keys\(getStyle\(block, "authorTitle"\)\)\.length > 0 \? getStyle\(block, "authorTitle"\) : \(Object\.keys\(getStyle\(block, "subtitle"\)\)\.length > 0 \? getStyle\(block, "subtitle"\) : getStyle\(block, "role"\)\)\), whiteSpace: "pre-line"\}\} className="text-text-muted whitespace-pre-line">\s*\{block\.authorTitle \|\| block\.subtitle \|\| block\.role\}\s*<\/p>/,
  `<p style={{...(Object.keys(getStyle(block, "authorTitle")).length > 0 ? getStyle(block, "authorTitle") : (Object.keys(getStyle(block, "subtitle")).length > 0 ? getStyle(block, "subtitle") : getStyle(block, "role"))), whiteSpace: "pre-line"}} className="text-text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: block.authorTitle || block.subtitle || block.role || '<span style="color:red">Yazar Unvanı eksik</span>' }} />`
);

code = code.substring(0, startIndex) + blockCode + code.substring(endIndex);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
