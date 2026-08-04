const fs = require('fs');
let code = fs.readFileSync('src/pages/PublicView.tsx', 'utf8');

const targetHeader = "if (headerDoc.exists()) setHeaderData(headerDoc.data());";
const replaceHeader = "if (headerDoc.exists()) resolveMediaUrls(headerDoc.data()).then(res => setHeaderData(res));";
code = code.replace(targetHeader, replaceHeader);

const targetFooter = "if (footerDoc.exists()) setFooterData(footerDoc.data());";
const replaceFooter = "if (footerDoc.exists()) resolveMediaUrls(footerDoc.data()).then(res => setFooterData(res));";
code = code.replace(targetFooter, replaceFooter);

const targetGeneral = "if (generalDoc.exists()) setSettings(generalDoc.data());";
const replaceGeneral = "if (generalDoc.exists()) resolveMediaUrls(generalDoc.data()).then(res => setSettings(res));";
code = code.replace(targetGeneral, replaceGeneral);

fs.writeFileSync('src/pages/PublicView.tsx', code);
console.log("Fixed PublicView settings fetch");
