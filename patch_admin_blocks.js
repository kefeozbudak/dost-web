import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'src/admin/BlockFormEditor.tsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

const menuEditorBlocks = `        {block.type === 'menu_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Badge (Etiket)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderImageUpload('Arkaplan Resmi', 'image')}
          </div>
        )}
        {block.type === 'menu_calendar' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderInputWithStyle('Ay (örn: Ekim 2023)', 'month')}
            {renderArrayEditor('days', [
              {key: 'date', label: 'Tarih (örn: 1 Paz)', type: 'text'},
              {key: 'kcal', label: 'Kalori (örn: 850 kcal)', type: 'text'},
              {key: 'meals', label: 'Yemekler (Virgülle Ayırın)', type: 'textarea'},
              {key: 'isCurrentMonth', label: 'Geçerli Ay Mı? (İşaretlenmezse silik görünür)', type: 'checkbox'},
              {key: 'isClosed', label: 'Tatil / Kapalı Mı?', type: 'checkbox'},
              {key: 'isToday', label: 'Bugün Mü?', type: 'checkbox'}
            ], "Takvim Günleri")}
          </div>
        )}
        {block.type === 'menu_features' && (
          <div className="space-y-4">
            {renderArrayEditor('items', [
              {key: 'icon', label: 'İkon (örn: nutrition)', type: 'icon'},
              {key: 'iconColor', label: 'Özel İkon Rengi', type: 'color'},
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'itemTitleColor', label: 'Özel Başlık Rengi', type: 'color'},
              {key: 'itemDescColor', label: 'Özel Açıklama Rengi', type: 'color'}
            ], "Özellikler")}
          </div>
        )}`;

let insertIndex = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('block.type === \'newsletter\'')) {
    // Find the end of this if block
    let balance = 0;
    let found = false;
    for (let j = i; j < lines.length; j++) {
      if (lines[j].includes('{')) balance += (lines[j].match(/\{/g) || []).length;
      if (lines[j].includes('}')) balance -= (lines[j].match(/\}/g) || []).length;
      if (balance === 0) {
        insertIndex = j + 1;
        found = true;
        break;
      }
    }
    if (found) break;
  }
}

if (insertIndex !== -1 && !fs.readFileSync(file, 'utf8').includes("block.type === 'menu_hero'")) {
  lines.splice(insertIndex, 0, menuEditorBlocks);
  fs.writeFileSync(file, lines.join('\n'));
  console.log("Successfully patched BlockFormEditor.tsx");
} else {
  console.log("Could not find insert point or already patched in BlockFormEditor.tsx");
}
