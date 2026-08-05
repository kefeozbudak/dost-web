const fs = require('fs');
let file = fs.readFileSync('./src/admin/PageEditor.tsx', 'utf8');

const targetStr = `{ type: 'career_application', label: 'İş Başvuru Formu' },`;

const newCode = `{ type: 'career_application', label: 'İş Başvuru Formu' },
                          { type: 'edu_system_hero', label: 'Eğitim Sistemi Hero' },
                          { type: 'edu_system_levels', label: 'Eğitim Kademeleri' },
                          { type: 'edu_system_yadep', label: 'YADEP Modülü' },
                          { type: 'edu_system_philosophy', label: 'Pedagojik Felsefe' },
                          { type: 'edu_system_cta', label: 'Eğitim CTA' },`;

file = file.replace(targetStr, newCode);
fs.writeFileSync('./src/admin/PageEditor.tsx', file);
