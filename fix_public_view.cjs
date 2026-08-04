const fs = require('fs');
let code = fs.readFileSync('src/pages/PublicView.tsx', 'utf8');

const resolveRegex = /async function resolveMediaUrls[\s\S]*?return obj;\n}/;
code = code.replace(resolveRegex, "import { resolveMediaUrls } from '../lib/resolveMedia';");

const fetchRegex = /resolveMediaUrls\(data, db\)\.then/g;
code = code.replace(fetchRegex, "resolveMediaUrls(data).then");

fs.writeFileSync('src/pages/PublicView.tsx', code);
console.log("Fixed PublicView");
