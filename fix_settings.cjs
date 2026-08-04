const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/SettingsCenter.tsx', 'utf8');

const importStatement = "import { resolveMediaUrls } from '../../lib/resolveMedia';\n";
if (!code.includes("resolveMediaUrls")) {
  code = importStatement + code;
  code = code.replace("setSettings({ ...defaultSettings, ...docSnap.data() });", "resolveMediaUrls({ ...defaultSettings, ...docSnap.data() }).then(resolved => setSettings(resolved));");
  fs.writeFileSync('src/admin/hubs/SettingsCenter.tsx', code);
  console.log("Fixed SettingsCenter");
}
