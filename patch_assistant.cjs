const fs = require('fs');
let content = fs.readFileSync('src/admin/hubs/AssistantCenter.tsx', 'utf8');
content = content.replace(
  "import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';",
  "import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';\nimport { withTimeout } from '../../lib/firebase';"
);
content = content.replace(
  "await setDoc(doc(db, 'settings', 'assistant'), {",
  "await withTimeout(setDoc(doc(db, 'settings', 'assistant'), {"
);
content = content.replace(
  "      }, { merge: true });",
  "      }, { merge: true }));"
);
fs.writeFileSync('src/admin/hubs/AssistantCenter.tsx', content);
