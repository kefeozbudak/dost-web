const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8');

code = code.replace(/\) : \(\n\{\(\(\) => \{/g, ") : (() => {");
code = code.replace(/\}\)\(\)\}\n                  \)\}/g, "})()\n                  )}");

fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', code);
console.log("Fixed syntax 2!");
