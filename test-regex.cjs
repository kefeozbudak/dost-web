const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const matches = [...code.matchAll(/<input\s+type="text"[^>]*?onChange=\{\s*\(e\)\s*=>\s*([\s\S]*?)\}[^>]*?>/g)];
let failed = 0;
for (let m of matches) {
  if (!m[1].includes('e.target.value')) {
    console.log("Does not contain e.target.value:", m[1]);
    failed++;
  }
}
console.log("Total text inputs with onChange:", matches.length, "Failed:", failed);
