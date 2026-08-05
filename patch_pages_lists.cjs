const fs = require('fs');

const file1 = './src/admin/hubs/AppearanceCenter.tsx';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace(
  `{ id: 'is-basvuru-formu', title: 'İş Başvuru Formu', path: '/is-basvuru-formu' },`,
  `{ id: 'is-basvuru-formu', title: 'İş Başvuru Formu', path: '/is-basvuru-formu' },
        { id: 'egitim-sistemimiz', title: 'Eğitim Sistemimiz', path: '/egitim-sistemimiz' },`
);
fs.writeFileSync(file1, content1);

const file2 = './src/admin/hubs/PopupCenter.tsx';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(
  `{ id: 'is-basvuru-formu', title: 'İş Başvuru Formu', path: '/is-basvuru-formu' },`,
  `{ id: 'is-basvuru-formu', title: 'İş Başvuru Formu', path: '/is-basvuru-formu' },
          { id: 'egitim-sistemimiz', title: 'Eğitim Sistemimiz', path: '/egitim-sistemimiz' },`
);
fs.writeFileSync(file2, content2);
