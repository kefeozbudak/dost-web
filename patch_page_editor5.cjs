const fs = require('fs');

let page_editor = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

page_editor = page_editor.replace(
    `bestMatch = { arrayKey: 'items', index: explicitArrayIndex };`,
    `bestMatch = { arrayKey: arrKey, index: explicitArrayIndex };`
);

fs.writeFileSync('src/admin/PageEditor.tsx', page_editor);
console.log("Patched PageEditor 5 successfully");
