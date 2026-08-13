const fs = require('fs');
let content = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8');
content = content.replace(
  "import { db } from '../../lib/firebase';",
  "import { db, withTimeout } from '../../lib/firebase';"
);
content = content.replace(
  /const popupToSave = await extractAndSaveBase64Images\(\{[\s\S]+?\}, db\);/m,
  `const popupToSave = await withTimeout(extractAndSaveBase64Images({
        ...selectedPopup,
        updatedAt: Date.now()
      }, db), 15000);`
);
content = content.replace(
  "await setDoc(doc(db, 'popups', selectedPopup.id), popupToSave);",
  "await withTimeout(setDoc(doc(db, 'popups', selectedPopup.id), popupToSave));"
);
fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', content);
