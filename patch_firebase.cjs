const fs = require('fs');
const file = 'src/lib/firebase.ts';
let content = fs.readFileSync(file, 'utf8');

const originalInit = `import { initializeApp } from "firebase/app";`;
const replacementInit = `import { initializeApp, getApps, getApp } from "firebase/app";`;
content = content.replace(originalInit, replacementInit);

const originalApp = `const app = initializeApp(firebaseConfig);`;
const replacementApp = `const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();`;
content = content.replace(originalApp, replacementApp);

fs.writeFileSync(file, content);
console.log("Patched firebase.ts");
