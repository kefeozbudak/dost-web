const fs = require('fs');
let file = fs.readFileSync('./src/admin/AdminLayout.tsx', 'utf8');

const targetStr = `{ id: 'is-basvuru-formu', title: 'İş Başvuru Formu', path: '/is-basvuru-formu' },`;
const replacementStr = `{ id: 'is-basvuru-formu', title: 'İş Başvuru Formu', path: '/is-basvuru-formu' },
          { id: 'egitim-sistemimiz', title: 'Eğitim Sistemimiz', path: '/egitim-sistemimiz' },`;

file = file.replace(targetStr, replacementStr);
fs.writeFileSync('./src/admin/AdminLayout.tsx', file);
