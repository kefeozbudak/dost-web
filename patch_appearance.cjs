const fs = require('fs');
let content = fs.readFileSync('src/admin/hubs/AppearanceCenter.tsx', 'utf8');
content = content.replace(
  "import { db } from '../../lib/firebase';",
  "import { db, withTimeout } from '../../lib/firebase';"
);
content = content.replace(
  "await setDoc(doc(db, 'settings', 'header'), headerData);",
  "await withTimeout(setDoc(doc(db, 'settings', 'header'), headerData));"
);
content = content.replace(
  "await setDoc(generalRef, {",
  "await withTimeout(setDoc(generalRef, {"
);
content = content.replace(
  "          updatedAt: Date.now()\n        });",
  "          updatedAt: Date.now()\n        }));"
);
content = content.replace(
  "await setDoc(doc(db, 'settings', 'footer'), footerData);",
  "await withTimeout(setDoc(doc(db, 'settings', 'footer'), footerData));"
);
fs.writeFileSync('src/admin/hubs/AppearanceCenter.tsx', content);
