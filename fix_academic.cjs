const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

code = code.replace(
  /\{renderArrayEditor\([\s\S]*?"days",[\s\S]*?\[[\s\S]*?\{[\s\S]*?key: "date",[\s\S]*?label: "Tarih \(Sadece sayı, örn: 1\)",[\s\S]*?type: "text",[\s\S]*?\},[\s\S]*?\{[\s\S]*?key: "isCurrentMonth",[\s\S]*?label: "Geçerli Ay Mı\? \(İşaretlenmezse silik görünür\)",[\s\S]*?type: "checkbox",[\s\S]*?\},[\s\S]*?\{ key: "isWeekend", label: "Hafta Sonu Mu\?", type: "checkbox" \},[\s\S]*?\{ key: "isToday", label: "Bugün Mü\?", type: "checkbox" \},[\s\S]*?\{[\s\S]*?key: "bgColor",[\s\S]*?label: "Hücre Arkaplan Rengi \(örn: bg-green-50\)",[\s\S]*?type: "text",[\s\S]*?\},[\s\S]*?\{ key: "eventTitle", label: "Etkinlik Başlığı", type: "text" \},[\s\S]*?\{[\s\S]*?key: "eventSubtitle",[\s\S]*?label: "Etkinlik Alt Açıklaması",[\s\S]*?type: "text",[\s\S]*?\},[\s\S]*?\{[\s\S]*?key: "eventColorClass",[\s\S]*?label:[\s\S]*?"Etkinlik Sınıfları \(örn: bg-secondary-fixed text-on-secondary-fixed-variant border-secondary\/20\)",[\s\S]*?type: "textarea",[\s\S]*?\},[\s\S]*?\],[\s\S]*?"Takvim Günleri",[\s\S]*?\)\}/,
  '<CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} />'
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
