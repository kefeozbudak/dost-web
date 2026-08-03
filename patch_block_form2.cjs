const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

content = content.replace(
    /\{key: 'url', label: 'Link URL', type: 'url'\}/,
    `{key: 'url', label: 'Link URL', type: 'url'},
              {key: 'buttonText', label: 'Buton Yazısı (Örn: Detaylı Bilgi)', type: 'text'},
              {key: 'buttonUrl', label: 'Buton Linki', type: 'url'}`
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Patched BlockFormEditor");
