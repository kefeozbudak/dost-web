import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'src/admin/PageEditor.tsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

const newBlocks = `                          { type: 'menu_hero', label: 'Yemek Menüsü Hero' },
                          { type: 'menu_calendar', label: 'Yemek Menüsü Takvim' },
                          { type: 'menu_features', label: 'Yemek Menüsü Özellikler' },`;

let insertIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("{ type: 'quote_image', label: 'Alıntı' }")) {
    insertIndex = i + 1;
    break;
  }
}

if (insertIndex !== -1 && !fs.readFileSync(file, 'utf8').includes("menu_hero")) {
  lines.splice(insertIndex, 0, newBlocks);
  fs.writeFileSync(file, lines.join('\n'));
  console.log("Successfully patched PageEditor.tsx again");
} else {
  console.log("Could not find insert point or already patched in PageEditor.tsx");
}
