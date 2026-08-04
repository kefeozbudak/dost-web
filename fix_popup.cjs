const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8');

const importStatement = "import { resolveMediaUrls } from '../../lib/resolveMedia';\n";
if (!code.includes("resolveMediaUrls")) {
  code = importStatement + code;
  code = code.replace("setPopups(popupsData);", "resolveMediaUrls(popupsData).then(res => setPopups(res));");
  
  // also fix save
  const targetSave = "await setDoc(doc(db, 'popups', popupToSave.id), popupToSave);";
  // wait we just need to resolve it on fetch, when they save, extractAndSaveBase64Images will run and return it.
  fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', code);
  console.log("Fixed PopupCenter");
}
