const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  ".split(/[,\\n]+/",
  ".split(/[,\n]+/"
);
content = content.replace(
  ".split(/[,\\n]+/",
  ".split(/[,\n]+/"
);
content = content.replace(
  ".split(/[,\n\r]+/",
  ".split(/[,\n]+/"
);

// Actually, the error shows:
// .split(/[,
// ]+/)
// Which means there is a literal newline inside the regex in the file.
// Let's just fix it by replacing the bad part.
const badString = \`.split(/[,
]+/)\`;

if (content.includes(badString)) {
   content = content.replace(badString, \`.split(/[,\\n]+/)\`);
}
fs.writeFileSync('src/components/PageBlocks.tsx', content);
