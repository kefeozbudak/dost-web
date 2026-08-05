const fs = require('fs');
let file = fs.readFileSync('./src/pages/PublicView.tsx', 'utf8');

const targetStr = `      } else if (docId === 'on-kayit' || cleanPath === '/on-kayit') {`;

const newCode = `      } else if (docId === 'egitim-sistemimiz' || cleanPath === '/egitim-sistemimiz') {
        import('../lib/defaultData').then(({ defaultEgitimSistemiData }) => {
          setPageData({
            title: 'Eğitim Sistemimiz',
            path: '/egitim-sistemimiz',
            blocks: defaultEgitimSistemiData
          });
        });
      } else if (docId === 'on-kayit' || cleanPath === '/on-kayit') {`;

file = file.replace(targetStr, newCode);
fs.writeFileSync('./src/pages/PublicView.tsx', file);
