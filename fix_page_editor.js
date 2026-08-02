import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'src/admin/PageEditor.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace("{ type: 'quote_image', label: 'Alıntı' }\n                          { type: 'menu_hero'", "{ type: 'quote_image', label: 'Alıntı' },\n                          { type: 'menu_hero'");
content = content.replace("label: 'Yemek Menüsü Özellikler' },\n                          { type: 'academic_calendar_hero'", "label: 'Yemek Menüsü Özellikler' },\n                          { type: 'academic_calendar_hero'"); // this is fine since it has a comma
fs.writeFileSync(file, content);
