const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');

const newUpload = `
import { collection, addDoc } from 'firebase/firestore';

// ... (we'll replace handleImageUpload)
  const handleImageUpload = async (file: File, isHeader: boolean) => {
    try {
      const base64 = await compressImage(file);
      const docRef = await addDoc(collection(db, 'media'), {
        name: file.name,
        url: base64,
        createdAt: Date.now()
      });
      const finalUrl = '/api/media/' + docRef.id;
      if (isHeader) {
        setHeaderData({ ...headerData, logoUrl: finalUrl });
      } else {
        setFooterData({ ...footerData, logoUrl: finalUrl });
      }
    } catch (e) {
      console.error(e);
      console.error('Resim yüklenirken hata oluştu');
    }
  };
`;

file = file.replace(/const handleImageUpload = async[\\s\\S]*?console\.error\('Resim yüklenirken hata oluştu'\);\n    \}\n  \};/, newUpload.split('// ... (we\'ll replace handleImageUpload)')[1].trim());

fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
