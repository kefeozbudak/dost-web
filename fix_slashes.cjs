const fs = require('fs');
const file = 'src/lib/styleUtils.ts';
let content = fs.readFileSync(file, 'utf8');

// Remove the backslashes before backticks and dollar signs
content = content.replace(/\\`/g, '`');
content = content.replace(/\\\$/g, '$');

fs.writeFileSync(file, content);
console.log("Fixed slashes in styleUtils");
