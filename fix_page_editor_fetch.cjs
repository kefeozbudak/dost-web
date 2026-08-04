const fs = require('fs');
let code = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const targetFetch = `        if (docSnap.exists()) {
          const data = docSnap.data(); data.blocks = data.blocks?.filter((b: any) => b.type !== "header" && b.type !== "footer"); setPageData(data);
        }`;
const newFetch = `        if (docSnap.exists()) {
          const data = docSnap.data(); 
          data.blocks = data.blocks?.filter((b: any) => b.type !== "header" && b.type !== "footer"); 
          resolveMediaUrls(data, db).then(resolved => setPageData(resolved));
        }`;

code = code.replace(targetFetch, newFetch);
fs.writeFileSync('src/admin/PageEditor.tsx', code);
console.log("Fixed PageEditor.tsx fetch");
