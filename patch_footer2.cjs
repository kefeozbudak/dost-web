const fs = require('fs');
let file = fs.readFileSync('./src/components/Footer.tsx', 'utf8');

const targetStr = `  const columns = data?.columns || [
    {
      title: 'Kurumsal',
      links: [
        { label: 'Hakkımızda', url: '#' },
        { label: 'Vizyon & Misyon', url: '#' },
        { label: 'Kurucularımız', url: '#' },
        { label: 'İnsan Kaynakları', url: '#' }
      ]
    },
    {
      title: 'Akademik',
      links: [
        { label: 'Anaokulu', url: '#' },
        { label: 'İlkokul', url: '#' },
        { label: 'Ortaokul', url: '#' },
        { label: 'Fen ve Anadolu Lisesi', url: '#' }
      ]
    },
    {
      title: 'Kampüslerimiz',
      links: [
        { label: 'Ümitköy Kampüsü', url: '#' },
        { label: 'Oran Kampüsü', url: '#' },
        { label: 'Eryaman Kampüsü', url: '#' }
      ]
    }
  ];`;

const replacementStr = `  let columns: any[] = [];
  
  // Header'daki mega menü veya alt menüleri al
  if (headerData && headerData.links) {
    headerData.links.forEach((link: any) => {
      if (link.type === 'dropdown' && link.subLinks && link.subLinks.length > 0) {
        columns.push({
          title: link.label,
          links: link.subLinks
        });
      } else if (link.type === 'mega' && link.megaMenu && link.megaMenu.columns) {
        link.megaMenu.columns.forEach((col: any) => {
          if (col.links && col.links.length > 0) {
            columns.push({
              title: col.title || link.label,
              links: col.links
            });
          }
        });
      } else if (link.type === 'normal' || !link.type) {
         // Eğer normal linkler için de bir kolon oluşturmak isterseniz
         // Şimdilik sadece alt menüsü olanları sütun yapıyoruz (Footer standartı)
      }
    });
  }
  
  // Eğer admin menüde görünümden footer'a özel kolon eklediyse onu da sonuna ekle
  if (data?.columns && data.columns.length > 0) {
     // Optional: data.columns'u da ekleyebiliriz ama kullanici otomatik sorsun dedi
     // Eger kullanici tamamen basliktan (header) almasini istiyorsa, asagidaki sekilde
     // sadece data.columns eger header'dan hicbir sey gelmezse kullanilsin.
  }

  // Eger hicbir yerden kolon gelmediyse varsayilan:
  if (columns.length === 0) {
    columns = data?.columns || [
      {
        title: 'Kurumsal',
        links: [
          { label: 'Hakkımızda', url: '#' },
          { label: 'Vizyon & Misyon', url: '#' },
          { label: 'Kurucularımız', url: '#' },
          { label: 'İnsan Kaynakları', url: '#' }
        ]
      },
      {
        title: 'Akademik',
        links: [
          { label: 'Anaokulu', url: '#' },
          { label: 'İlkokul', url: '#' },
          { label: 'Ortaokul', url: '#' },
          { label: 'Fen ve Anadolu Lisesi', url: '#' }
        ]
      },
      {
        title: 'Kampüslerimiz',
        links: [
          { label: 'Ümitköy Kampüsü', url: '#' },
          { label: 'Oran Kampüsü', url: '#' },
          { label: 'Eryaman Kampüsü', url: '#' }
        ]
      }
    ];
  }`;

file = file.replace(targetStr, replacementStr);
fs.writeFileSync('./src/components/Footer.tsx', file);
