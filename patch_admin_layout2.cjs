const fs = require('fs');
let code = fs.readFileSync('src/admin/AdminLayout.tsx', 'utf8');

code = code.replace(
    "import { collection, onSnapshot } from 'firebase/firestore';",
    "import { collection, onSnapshot, getDoc, setDoc, doc } from 'firebase/firestore';"
);
fs.writeFileSync('src/admin/AdminLayout.tsx', code);
