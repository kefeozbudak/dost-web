const fs = require('fs');
let code = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const targetHelper = `export default function PageEditor() {`;
const newHelper = `async function resolveMediaUrls(obj: any, db: any): Promise<any> {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('/api/media/')) {
      const mediaId = obj.split('/api/media/')[1];
      if (mediaId) {
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const mediaSnap = await getDoc(doc(db, 'media', mediaId));
          if (mediaSnap.exists()) {
            const mediaData = mediaSnap.data();
            if (mediaData.url) {
              return mediaData.url;
            }
          }
        } catch(e) {}
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => resolveMediaUrls(item, db)));
  }
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await resolveMediaUrls(obj[key], db);
    }
    return newObj;
  }
  return obj;
}

export default function PageEditor() {`;

code = code.replace(targetHelper, newHelper);

const targetFetch = `        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.isDeleted) {
            setPageData(data);
          }`;
const newFetch = `        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.isDeleted) {
            resolveMediaUrls(data, db).then(resolved => {
              setPageData(resolved);
            });
          }`;

code = code.replace(targetFetch, newFetch);

fs.writeFileSync('src/admin/PageEditor.tsx', code);
console.log("Updated PageEditor.tsx");
