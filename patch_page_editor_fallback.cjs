const fs = require('fs');
let file = fs.readFileSync('./src/admin/PageEditor.tsx', 'utf8');

const targetStr = `} else if (pageId === 'is-basvuru-formu') {`;
const newCode = `} else if (pageId === 'egitim-sistemimiz') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Eğitim Sistemimiz', path: '/egitim-sistemimiz', blocks: module.defaultEgitimSistemiData };
            setPageData(defaultData);
          });
        } else if (pageId === 'is-basvuru-formu') {`;

file = file.replace(targetStr, newCode);
fs.writeFileSync('./src/admin/PageEditor.tsx', file);
