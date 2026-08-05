const fs = require('fs');
let file = fs.readFileSync('./src/pages/PublicView.tsx', 'utf8');

const targetStr = `      } else if (docId === 'on-kayit' || cleanPath === '/on-kayit') {`;

const insertStr = `      } else if (docId === 'is-basvuru-formu' || cleanPath === '/is-basvuru-formu') {
        setPageData({
          title: 'İş Başvuru Formu',
          path: '/is-basvuru-formu',
          blocks: [
            { type: 'career_hero', title: "Dost Koleji'nde Kariyer" },
            { type: 'career_benefits', title: "Neden Bize Katılmalısınız?" },
            { type: 'career_application', title: "Mevcut Açık Pozisyonlar" }
          ]
        });
`;

file = file.replace(targetStr, insertStr + targetStr);
fs.writeFileSync('./src/pages/PublicView.tsx', file);
