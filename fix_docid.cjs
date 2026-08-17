const fs = require('fs');
let code = fs.readFileSync('src/pages/PublicView.tsx', 'utf8');

code = code.replace(
  /const docId = \['is-basvuru-formu'.*?; \/\/.*/,
  `const docId = ['is-basvuru-formu', 'is-basvuru', 'isbasvurusu', 'isbasvuru'].includes(docIdRaw) ? 'is-basvurusu' : ['bursluluk-sinavi', 'bursluluk-basvurusu'].includes(docIdRaw) ? 'bursluluk-basvuru-formu' : docIdRaw;`
);

fs.writeFileSync('src/pages/PublicView.tsx', code);
