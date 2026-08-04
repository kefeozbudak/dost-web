const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/AppearanceCenter.tsx', 'utf8');

const importStatement = "import { resolveMediaUrls } from '../../lib/resolveMedia';\n";
if (!code.includes("resolveMediaUrls")) {
  code = importStatement + code;
  code = code.replace("if (headerDoc.exists()) setHeaderData(headerDoc.data());", "if (headerDoc.exists()) resolveMediaUrls(headerDoc.data()).then(res => setHeaderData(res));");
  code = code.replace("if (footerDoc.exists()) setFooterData(footerDoc.data());", "if (footerDoc.exists()) resolveMediaUrls(footerDoc.data()).then(res => setFooterData(res));");
  
  // also fix save
  const targetHeaderSave = "await setDoc(doc(db, 'settings', 'header'), headerData, { merge: true });";
  code = code.replace(targetHeaderSave, targetHeaderSave + "\n      resolveMediaUrls(headerData).then(res => setHeaderData(res));");
  
  const targetFooterSave = "await setDoc(doc(db, 'settings', 'footer'), footerData, { merge: true });";
  code = code.replace(targetFooterSave, targetFooterSave + "\n      resolveMediaUrls(footerData).then(res => setFooterData(res));");

  fs.writeFileSync('src/admin/hubs/AppearanceCenter.tsx', code);
  console.log("Fixed AppearanceCenter");
}
