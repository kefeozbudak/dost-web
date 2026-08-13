const fs = require('fs');
let content = fs.readFileSync('src/admin/hubs/AssistantCenter.tsx', 'utf8');
content = content.replace(
  "import { doc, getDoc, setDoc } from 'firebase/firestore';",
  "import { doc, getDoc, setDoc } from 'firebase/firestore';\nimport { withTimeout } from '../../lib/firebase';"
);
fs.writeFileSync('src/admin/hubs/AssistantCenter.tsx', content);
