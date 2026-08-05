const fs = require('fs');
let file = fs.readFileSync('./src/admin/BlockFormEditor.tsx', 'utf8');

file = file.replace(
  `{renderListManager('Kademeler (Items)', 'items')}`,
  `{renderArrayEditor('items', [
              { key: 'title', label: 'Başlık', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' },
              { key: 'url', label: 'Link URL', type: 'url' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' }
            ], 'Kademeler (Items)')}`
);

file = file.replace(
  `{renderListManager('YADEP Kartları (Items)', 'items')}`,
  `{renderArrayEditor('items', [
              { key: 'title', label: 'Başlık', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' }
            ], 'YADEP Kartları (Items)')}`
);

file = file.replace(
  `{renderListManager('Özellikler (Items)', 'items')}`,
  `{renderArrayEditor('items', [
              { key: 'title', label: 'Başlık', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' }
            ], 'Özellikler (Items)')}`
);

file = file.replace(
  `{renderListManager('Butonlar', 'buttons')}`,
  `{renderArrayEditor('buttons', [
              { key: 'label', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Link URL', type: 'url' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' }
            ], 'Butonlar')}`
);

file = file.replace(
  `{renderListManager('Avantajlar (Items)', 'items')}`,
  `{renderArrayEditor('items', [
              { key: 'title', label: 'Başlık', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'icon', label: 'İkon (Material)', type: 'icon' },
              { key: 'iconColor', label: 'İkon Rengi (Sınıf)', type: 'text' },
              { key: 'iconBg', label: 'İkon Arka Plan (Sınıf)', type: 'text' }
            ], 'Avantajlar (Items)')}`
);

file = file.replace(
  `{renderListManager('Açık Pozisyonlar (Items)', 'items')}`,
  `{renderArrayEditor('items', [
              { key: 'title', label: 'Pozisyon Başlığı', type: 'text' },
              { key: 'type', label: 'Çalışma Tipi (örn: TAM ZAMANLI)', type: 'text' },
              { key: 'dept', label: 'Bölüm (örn: Lise Bölümü)', type: 'text' },
              { key: 'val', label: 'Değer / ID', type: 'text' }
            ], 'Açık Pozisyonlar (Items)')}`
);

file = file.replace(
  `{renderListManager('Ekstra Form Alanları', 'inputs')}`,
  `{renderArrayEditor('inputs', [
              { key: 'label', label: 'Label', type: 'text' },
              { key: 'name', label: 'Alan Adı (name)', type: 'text' },
              { key: 'type', label: 'Input Tipi', type: 'select', options: [
                  {value: 'text', label: 'Metin'},
                  {value: 'email', label: 'E-Posta'},
                  {value: 'tel', label: 'Telefon'},
                  {value: 'select', label: 'Seçim Kutusu'},
                  {value: 'checkbox', label: 'Onay Kutusu'}
              ]},
              { key: 'options', label: 'Seçenekler (select ise, virgülle)', type: 'text' }
            ], 'Ekstra Form Alanları')}`
);

fs.writeFileSync('./src/admin/BlockFormEditor.tsx', file);
