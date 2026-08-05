const fs = require('fs');
let file = fs.readFileSync('./src/components/Footer.tsx', 'utf8');

file = file.replace(
  "export default function Footer({ data }: { data?: any }) {",
  "export default function Footer({ data, headerData }: { data?: any; headerData?: any }) {"
);

const oldColumnsCode = `  const columns = data?.columns || [
    {
      title: 'Hakkımızda',
      links: [
        { label: 'Vizyon & Misyon', url: '#' },
        { label: 'Tarihçe', url: '#' },
        { label: 'Yönetim', url: '#' }
      ]
    },
    {
      title: 'Akademik',
      links: [
        { label: 'Anaokulu', url: '#' },
        { label: 'İlkokul', url: '#' },
        { label: 'Ortaokul', url: '#' },
        { label: 'Lise', url: '#' }
      ]
    },
    {
      title: 'Hızlı Linkler',
      links: [
        { label: 'Kayıt Kabul', url: '#' },
        { label: 'Bursluluk Sınavı', url: '#' },
        { label: 'İletişim', url: '#' }
      ]
    }
  ];`;

const newColumnsCode = `  let columns = [];
  if (headerData && headerData.links) {
    headerData.links.forEach((link: any) => {
      if (link.type === 'dropdown' && link.subLinks && link.subLinks.length > 0) {
        columns.push({
          title: link.label,
          links: link.subLinks
        });
      } else if (link.type === 'mega' && link.megaMenu && link.megaMenu.columns) {
        // Option A: Just use the main label as a column and flatten the mega menu links
        // Option B: Map each mega menu column to a footer column
        link.megaMenu.columns.forEach((col: any) => {
          if (col.links && col.links.length > 0) {
            columns.push({
              title: col.title || link.label,
              links: col.links
            });
          }
        });
      } else {
        // Note: we can optionally push normal links to a "Hızlı Linkler" column, 
        // but typically footer columns are derived from dropdowns and mega menus.
      }
    });
  }
  
  if (columns.length === 0) {
    columns = data?.columns || [
      {
        title: 'Hakkımızda',
        links: [
          { label: 'Vizyon & Misyon', url: '#' },
          { label: 'Tarihçe', url: '#' },
          { label: 'Yönetim', url: '#' }
        ]
      },
      {
        title: 'Akademik',
        links: [
          { label: 'Anaokulu', url: '#' },
          { label: 'İlkokul', url: '#' },
          { label: 'Ortaokul', url: '#' },
          { label: 'Lise', url: '#' }
        ]
      },
      {
        title: 'Hızlı Linkler',
        links: [
          { label: 'Kayıt Kabul', url: '#' },
          { label: 'Bursluluk Sınavı', url: '#' },
          { label: 'İletişim', url: '#' }
        ]
      }
    ];
  }`;

file = file.replace(oldColumnsCode, newColumnsCode);

fs.writeFileSync('./src/components/Footer.tsx', file);
