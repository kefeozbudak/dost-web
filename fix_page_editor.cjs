const fs = require('fs');
let code = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

// 1. Remove the local resolveMediaUrls function
const resolveRegex = /async function resolveMediaUrls[\s\S]*?return obj;\n}/;
code = code.replace(resolveRegex, "import { resolveMediaUrls } from '../lib/resolveMedia';");

// 2. Fix the fetch logic to remove passing `db` to resolveMediaUrls
const fetchRegex = /resolveMediaUrls\(data, db\)\.then/g;
code = code.replace(fetchRegex, "resolveMediaUrls(data).then");

// 3. Fix handleSave logic to resolve after saving
const handleSaveTarget = `      console.log("Saving dataToSave:", dataToSave);
      await setDoc(doc(db, 'pages', pageId), dataToSave, { merge: true });
      setPageData(dataToSave);
      alert('Sayfa başarıyla kaydedildi!');`;

const handleSaveReplacement = `      console.log("Saving dataToSave:", dataToSave);
      await setDoc(doc(db, 'pages', pageId), dataToSave, { merge: true });
      resolveMediaUrls(dataToSave).then(resolved => setPageData(resolved));
      alert('Sayfa başarıyla kaydedildi!');`;

code = code.replace(handleSaveTarget, handleSaveReplacement);

fs.writeFileSync('src/admin/PageEditor.tsx', code);
console.log("Fixed PageEditor");
