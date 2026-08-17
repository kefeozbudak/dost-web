const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf-8');

// The issue is id={\`overlay-toggle-\${index}\`} and htmlFor={\`overlay-toggle-\${index}\`}
// We can just use id="overlay-toggle" + block.type or Math.random()
// Or better yet, wrap the input inside the label.

content = content.replace(/id=\{\`overlay-toggle-\$\{index\}\`\}/g, '');
content = content.replace(/htmlFor=\{\`overlay-toggle-\$\{index\}\`\}/g, '');

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Fixed slider id error");
