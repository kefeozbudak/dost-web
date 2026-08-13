const fs = require('fs');

const file1 = 'src/components/SchoolBlocks.tsx';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace(/\(block\.overlayCard\?\.enabled \?\? \(block\.type !== "high_school_hero"\)\)/g, '(block.overlayCard?.enabled !== false)');
fs.writeFileSync(file1, content1);
console.log("Patched SchoolBlocks.tsx");

const file2 = 'src/admin/BlockFormEditor.tsx';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(/\(block\.overlayCard\?\.enabled \?\? \(block\.type !== 'high_school_hero'\)\)/g, '(block.overlayCard?.enabled !== false)');
fs.writeFileSync(file2, content2);
console.log("Patched BlockFormEditor.tsx");
