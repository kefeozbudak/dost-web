const fs = require('fs');
let code = fs.readFileSync('src/pages/PublicView.tsx', 'utf8');
code = code.replace(/resolveMediaUrls\(headerDoc\.data\(\), db\)/g, "resolveMediaUrls(headerDoc.data())");
code = code.replace(/resolveMediaUrls\(footerDoc\.data\(\), db\)/g, "resolveMediaUrls(footerDoc.data())");
code = code.replace(/resolveMediaUrls\(data, db\)/g, "resolveMediaUrls(data)");
fs.writeFileSync('src/pages/PublicView.tsx', code);
console.log("Fixed PublicView");
