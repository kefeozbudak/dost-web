const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf-8');

// First remove from renderCommonFields
content = content.replace('{renderHeroOverlaySetting()}\n      {renderTextareaWithStyle', '{renderTextareaWithStyle');

// Now add it to all hero blocks. We look for `{block.type === "...hero" && (` and the following `<div className="space-y-4">`.
const lines = content.split('\n');
const newLines = [];
let insideHero = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  newLines.push(line);
  
  if (line.match(/\{block\.type === ['"].*hero['"] && \(/) || line.match(/\{\(block\.type === ['"].*hero['"] \|\|/)) {
    insideHero = true;
  }
  
  if (insideHero && line.includes('<div className="space-y-4">')) {
    newLines.push('            {renderHeroOverlaySetting()}');
    insideHero = false;
  }
}

fs.writeFileSync('src/admin/BlockFormEditor.tsx', newLines.join('\n'));
console.log("Patched all heroes");
