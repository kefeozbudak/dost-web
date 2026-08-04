import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const compressImageFile = (
  file: File, 
  maxWidth = 2000, 
  maxHeight = 2000, 
  quality = 0.88
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawBase64 = e.target?.result as string;
      // If raw image fits in Firestore document (< 950,000 bytes), keep 100% original!
      if (rawBase64.length <= 950000) {
        resolve(rawBase64);
        return;
      }

      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(rawBase64);
          return;
        }

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(rawBase64);
      img.src = rawBase64;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const extractAndSaveBase64Images = async (obj: any, db: any): Promise<any> => {
  if (!obj) return obj;

  if (typeof obj === 'string') {
    if (obj.startsWith('data:image/')) {
      try {
        let base64ToSave = obj;
        if (base64ToSave.length > 950000) {
          // Gently scale down very huge image so it fits in media document
          base64ToSave = await new Promise<string>((resolve) => {
            const img = new Image();
            img.onload = () => {
              let width = img.width;
              let height = img.height;
              const maxWidth = 2000;
              const maxHeight = 2000;
              if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                  height = Math.round((height * maxWidth) / width);
                  width = maxWidth;
                } else {
                  width = Math.round((width * maxHeight) / height);
                  height = maxHeight;
                }
              }
              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) { resolve(obj); return; }
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, width, height);
              ctx.drawImage(img, 0, 0, width, height);
              resolve(canvas.toDataURL('image/jpeg', 0.88));
            };
            img.onerror = () => resolve(obj);
            img.src = obj;
          });
        }

        const docRef = await addDoc(collection(db, 'media'), {
          name: 'Sayfa Görseli',
          url: base64ToSave,
          createdAt: serverTimestamp()
        });

        console.log(`Auto-extracted Base64 image to media/${docRef.id}`);
        return `/api/media/${docRef.id}`;
      } catch (err) {
        console.error('Error saving extracted image to media collection:', err);
        return obj;
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    const newArr = [];
    for (const item of obj) {
      newArr.push(await extractAndSaveBase64Images(item, db));
    }
    return newArr;
  }

  if (typeof obj === 'object') {
    if (obj.constructor && obj.constructor.name !== 'Object' && obj.constructor.name !== 'Array') {
      return obj;
    }
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      const val = await extractAndSaveBase64Images(obj[key], db);
      if (val !== undefined) {
        newObj[key] = val;
      }
    }
    return newObj;
  }

  return obj;
};
