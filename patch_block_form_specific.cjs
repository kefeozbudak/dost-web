const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const target = `            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'url', label: 'Link URL', type: 'url'}
            ], "Öğeler", true)}`;

const replacement = `            {renderArrayEditor('items', [
              {key: 'title', label: 'Başlık', type: 'text'},
              {key: 'icon', label: 'İkon', type: 'icon'},
              {key: 'image', label: 'Görsel', type: 'image'},
              {key: 'desc', label: 'Açıklama', type: 'textarea'},
              {key: 'url', label: 'Link URL', type: 'url'},
              {key: 'buttonText', label: 'Buton Yazısı (Örn: Detaylı Bilgi)', type: 'text'},
              {key: 'buttonUrl', label: 'Buton Linki', type: 'url'}
            ], "Öğeler", true)}`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
    console.log("Patched correctly.");
} else {
    console.log("Target not found.");
}
