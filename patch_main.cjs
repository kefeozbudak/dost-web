const fs = require('fs');
const file = 'src/main.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('<StrictMode>', '');
content = content.replace('</StrictMode>', '');
content = content.replace('import { StrictMode } from "react";', '');

fs.writeFileSync(file, content);
console.log("Patched main.tsx");
