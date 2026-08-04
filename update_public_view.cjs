const fs = require('fs');
let code = fs.readFileSync('src/pages/PublicView.tsx', 'utf8');

const targetHelper = `function cleanBrokenImages(obj: any, contextTitle = ''): any {`;
const newHelper = `async function resolveMediaUrls(obj: any, db: any): Promise<any> {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('/api/media/')) {
      const mediaId = obj.split('/api/media/')[1];
      if (mediaId) {
        try {
          // Import here to avoid top-level issues if not imported
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

function cleanBrokenImages(obj: any, contextTitle = ''): any {`;

code = code.replace(targetHelper, newHelper);

const targetFetch = `        let data = docSnap.data();
        
        if (data.isDeleted || data.isHidden) {`;
const newFetch = `        let data = docSnap.data();
        
        // Resolve /api/media/ URLs to their actual Firestore URLs
        data = await resolveMediaUrls(data, db);
        
        if (data.isDeleted || data.isHidden) {`;

code = code.replace(targetFetch, newFetch);

// Do the same for header/footer and settings in fetchSettings
const targetHeader = `        if (headerDoc.exists()) {
          setHeaderData(headerDoc.data());
        }`;
const newHeader = `        if (headerDoc.exists()) {
          setHeaderData(await resolveMediaUrls(headerDoc.data(), db));
        }`;
code = code.replace(targetHeader, newHeader);

const targetFooter = `        if (footerDoc.exists()) {
          setFooterData(footerDoc.data());
        }`;
const newFooter = `        if (footerDoc.exists()) {
          setFooterData(await resolveMediaUrls(footerDoc.data(), db));
        }`;
code = code.replace(targetFooter, newFooter);

fs.writeFileSync('src/pages/PublicView.tsx', code);
console.log("Updated PublicView.tsx");
