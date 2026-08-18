const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

code = code.replace(
  /\{renderArrayEditor\([\s\S]*?"days",[\s\S]*?\[[\s\S]*?\{ key: "date", label: "Tarih \(örn: 1 Paz\)", type: "text" \},[\s\S]*?\{ key: "kcal", label: "Kalori \(örn: 850 kcal\)", type: "text" \},[\s\S]*?\{[\s\S]*?key: "meals",[\s\S]*?label: "Yemekler \(Virgülle Ayırın\)",[\s\S]*?type: "textarea",[\s\S]*?\},[\s\S]*?\{[\s\S]*?key: "isCurrentMonth",[\s\S]*?label: "Geçerli Ay Mı\? \(İşaretlenmezse silik görünür\)",[\s\S]*?type: "checkbox",[\s\S]*?\},[\s\S]*?\{ key: "isToday", label: "Bugün Mü\?", type: "checkbox" \},[\s\S]*?\],[\s\S]*?"Takvim Günleri",[\s\S]*?\)\}/,
  '<CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} />'
);

code = code.replace(
  /\{renderArrayEditor\([\s\S]*?"days",[\s\S]*?\[[\s\S]*?\{ key: "date", label: "Tarih \(örn: 1\)", type: "text" \},[\s\S]*?\{ key: "events", label: "Etkinlikler \(Virgülle Ayırın\)", type: "textarea" \},[\s\S]*?\{ key: "isCurrentMonth", label: "Geçerli Ay Mı\? \(İşaretlenmezse silik görünür\)", type: "checkbox" \},[\s\S]*?\{ key: "isToday", label: "Bugün Mü\?", type: "checkbox" \},[\s\S]*?\],[\s\S]*?"Günler"[\s\S]*?\)\}/,
  '<CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} />'
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
