import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'src/admin/BlockFormEditor.tsx');
let lines = fs.readFileSync(file, 'utf8').split('\n');

const academicEditorBlocks = `        {block.type === 'academic_calendar_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderImageUpload('Arkaplan Resmi', 'image')}
          </div>
        )}
        {block.type === 'academic_calendar' && (
          <div className="space-y-4">
            {renderInputWithStyle('Ay (örn: Ekim 2023)', 'month')}
            {renderInputWithStyle('PDF URL', 'pdfUrl')}
            {renderInputWithStyle('PDF Buton Metni', 'pdfButtonText')}
            
            {renderArrayEditor('days', [
              {key: 'date', label: 'Tarih (Sadece sayı, örn: 1)', type: 'text'},
              {key: 'isCurrentMonth', label: 'Geçerli Ay Mı? (İşaretlenmezse silik görünür)', type: 'checkbox'},
              {key: 'isWeekend', label: 'Hafta Sonu Mu?', type: 'checkbox'},
              {key: 'isToday', label: 'Bugün Mü?', type: 'checkbox'},
              {key: 'bgColor', label: 'Hücre Arkaplan Rengi (örn: bg-green-50)', type: 'text'},
              {key: 'eventTitle', label: 'Etkinlik Başlığı', type: 'text'},
              {key: 'eventSubtitle', label: 'Etkinlik Alt Açıklaması', type: 'text'},
              {key: 'eventColorClass', label: 'Etkinlik Sınıfları (örn: bg-secondary-fixed text-on-secondary-fixed-variant border-secondary/20)', type: 'textarea'}
            ], "Takvim Günleri")}

            {renderArrayEditor('legends', [
              {key: 'icon', label: 'İkon (örn: edit_document)', type: 'icon'},
              {key: 'iconBgClass', label: 'İkon Arkaplan Sınıfı (örn: bg-error-container)', type: 'text'},
              {key: 'iconColorClass', label: 'İkon Renk Sınıfı (örn: text-on-error-container)', type: 'text'},
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'buttonText', label: 'Link Metni (İncele)', type: 'text'},
              {key: 'itemTitleColor', label: 'Özel Başlık Rengi', type: 'color'},
              {key: 'itemDescColor', label: 'Özel Açıklama Rengi', type: 'color'}
            ], "Lejant (Açıklama) Kartları")}
          </div>
        )}`;

let insertIndex = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes('block.type === \'menu_features\'')) {
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

if (insertIndex !== -1 && !fs.readFileSync(file, 'utf8').includes("block.type === 'academic_calendar'")) {
  lines.splice(insertIndex, 0, academicEditorBlocks);
  fs.writeFileSync(file, lines.join('\n'));
  console.log("Successfully patched BlockFormEditor.tsx");
} else {
  console.log("Could not find insert point or already patched in BlockFormEditor.tsx");
}
