with open("src/admin/hubs/AppearanceCenter.tsx", "r") as f:
    content = f.read()

import re

compress_func = """
const compressImage = (file: File, maxWidth = 800, maxHeight = 800, quality = 0.5): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(error);
    };
    img.src = objectUrl;
  });
};
"""

old_upload = """  const handleImageUpload = (file: File, isHeader: boolean) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isHeader) {
        setHeaderData({ ...headerData, logoUrl: reader.result });
      } else {
        setFooterData({ ...footerData, logoUrl: reader.result });
      }
    };
    reader.readAsDataURL(file);
  };"""

new_upload = """  const handleImageUpload = async (file: File, isHeader: boolean) => {
    try {
      const base64 = await compressImage(file);
      if (isHeader) {
        setHeaderData({ ...headerData, logoUrl: base64 });
      } else {
        setFooterData({ ...footerData, logoUrl: base64 });
      }
    } catch (e) {
      console.error(e);
      alert('Resim yüklenirken hata oluştu');
    }
  };"""

content = content.replace("export default function AppearanceCenter() {", compress_func + "\nexport default function AppearanceCenter() {")
content = content.replace(old_upload, new_upload)

with open("src/admin/hubs/AppearanceCenter.tsx", "w") as f:
    f.write(content)
