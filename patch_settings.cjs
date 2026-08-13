const fs = require('fs');
let content = fs.readFileSync('src/admin/hubs/SettingsCenter.tsx', 'utf8');
content = content.replace(
  "import { doc, getDoc, setDoc } from 'firebase/firestore';",
  "import { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { withTimeout } from '../../lib/firebase';"
);
content = content.replace(
  "await setDoc(docRef, updatedData, { merge: true });",
  "await withTimeout(setDoc(docRef, updatedData, { merge: true }));"
);
fs.writeFileSync('src/admin/hubs/SettingsCenter.tsx', content);
