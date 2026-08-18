const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf-8');
content = content.replace(
  '<div>\n              {block.type.includes("hero") && (',
  '<div>\n              {(block.type.includes("hero") || block.type === "about_hero" || block.type === "academic_hero" || block.type === "bursluluk_hero") && ('
);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
