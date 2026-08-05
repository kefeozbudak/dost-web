const fs = require('fs');

let content = fs.readFileSync('./src/admin/PageEditor.tsx', 'utf8');
content = content.replace(
  /catch \(e: any\) \{\n\s*console.error\("Save error:", e\);/g,
  `catch (e: any) {
      console.error("Save error during setDoc or extractAndSaveBase64Images:", e);`
);
fs.writeFileSync('./src/admin/PageEditor.tsx', content);

let mc = fs.readFileSync('./src/admin/hubs/MediaCenter.tsx', 'utf8');
mc = mc.replace(
  /catch \(err\) \{\n\s*console.error\("Error fetching media", err\);/g,
  `catch (err) {
      console.error("Error fetching media in MediaCenter:", err);`
);
fs.writeFileSync('./src/admin/hubs/MediaCenter.tsx', mc);

