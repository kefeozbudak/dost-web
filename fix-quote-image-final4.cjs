const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Insert helpers at the top
const helpers = `
const getValidText = (...values: any[]) => {
  for (const v of values) {
    if (typeof v === 'string') {
      const stripped = v.replace(/<[^>]*>?/gm, '').trim();
      if (stripped.length > 0) return v;
    } else if (v) {
      return v;
    }
  }
  return values[values.length - 1] || "";
};

const getValidStyle = (block: any, ...keys: string[]) => {
  for (const key of keys) {
    const s = getStyle(block, key);
    if (Object.keys(s).length > 0) return s;
  }
  return {};
};
`;

if (!code.includes('const getValidText')) {
  // Put it right after getIndividualButtonStyle
  const marker = 'const getIndividualButtonStyle = (btn: any) => {';
  const lastBrace = code.indexOf('};', code.indexOf(marker)) + 2;
  code = code.substring(0, lastBrace) + '\n' + helpers + code.substring(lastBrace);
}

// Rewrite quote_image text elements
const startIndex = code.indexOf('case "quote_image":');
const endIndex = code.indexOf('case "academic_hero":', startIndex);
let blockCode = code.substring(startIndex, endIndex);

blockCode = blockCode.replace(
  /<div\s*style=\{\{\.\.\.\(Object\.keys\(getStyle\(block, "quote"\)\)\.length > 0 \? getStyle\(block, "quote"\) : getStyle\(block, "desc"\)\), whiteSpace: "pre-line"\}\}\s*className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line"\s*dangerouslySetInnerHTML=\{\{ __html: block\.quote \|\| block\.desc \|\| '<span style="color:red">Lütfen admin panelinden Alıntı Metni \(Quote\) alanını doldurun\.<\/span>' \}\}\s*\/>/,
  `<div
                        style={{...getValidStyle(block, "quote", "desc"), whiteSpace: "pre-line"}}
                        className="font-body-lg text-body-lg text-text-main italic mb-8 leading-relaxed whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: getValidText(block.quote, block.desc, '<span style="color:red">Lütfen admin panelinden Alıntı Metni (Quote) alanını doldurun.</span>') }}
                      />`
);

blockCode = blockCode.replace(
  /<h4 style=\{\{\.\.\.\(Object\.keys\(getStyle\(block, "authorName"\)\)\.length > 0 \? getStyle\(block, "authorName"\) : getStyle\(block, "name"\)\), whiteSpace: "pre-line"\}\} className="font-headline-md text-headline-md text-primary whitespace-pre-line" dangerouslySetInnerHTML=\{\{ __html: block\.authorName \|\| block\.name \|\| '<span style="color:red">Yazar Adı eksik<\/span>' \}\} \/>/,
  `<h4 style={{...getValidStyle(block, "authorName", "name"), whiteSpace: "pre-line"}} className="font-headline-md text-headline-md text-primary whitespace-pre-line" dangerouslySetInnerHTML={{ __html: getValidText(block.authorName, block.name, '<span style="color:red">Lütfen Yazar Adı Girin</span>') }} />`
);

blockCode = blockCode.replace(
  /<p style=\{\{\.\.\.\(Object\.keys\(getStyle\(block, "authorTitle"\)\)\.length > 0 \? getStyle\(block, "authorTitle"\) : \(Object\.keys\(getStyle\(block, "subtitle"\)\)\.length > 0 \? getStyle\(block, "subtitle"\) : getStyle\(block, "role"\)\)\), whiteSpace: "pre-line"\}\} className="text-text-muted whitespace-pre-line" dangerouslySetInnerHTML=\{\{ __html: block\.authorTitle \|\| block\.subtitle \|\| block\.role \|\| '<span style="color:red">Yazar Unvanı eksik<\/span>' \}\} \/>/,
  `<p style={{...getValidStyle(block, "authorTitle", "subtitle", "role"), whiteSpace: "pre-line"}} className="text-text-muted whitespace-pre-line" dangerouslySetInnerHTML={{ __html: getValidText(block.authorTitle, block.subtitle, block.role, '<span style="color:red">Lütfen Yazar Ünvanı Girin</span>') }} />`
);

code = code.substring(0, startIndex) + blockCode + code.substring(endIndex);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("quote_image updated with robust whitespace fallback");
