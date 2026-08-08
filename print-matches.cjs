const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const matches = [...code.matchAll(/<div className="flex [^>]*>(\s*<input\s+type="color"[\s\S]*?)<\/div>/g)];
let validMatches = matches.filter(m => m[0].includes('type="text"'));
console.log("Found:", validMatches.length);
if (validMatches.length > 0) {
  console.log(validMatches[0][0]);
  console.log("-------------------");
  console.log(validMatches[1][0]);
}
