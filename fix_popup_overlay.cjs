const fs = require('fs');
let code = fs.readFileSync('src/components/PopupOverlay.tsx', 'utf8');

const importStatement = "import { resolveMediaUrls } from '../lib/resolveMedia';\n";
if (!code.includes("resolveMediaUrls")) {
  code = importStatement + code;
  code = code.replace("setPopups(activePopups);", "resolveMediaUrls(activePopups).then(res => setPopups(res));");
  fs.writeFileSync('src/components/PopupOverlay.tsx', code);
  console.log("Fixed PopupOverlay");
}
