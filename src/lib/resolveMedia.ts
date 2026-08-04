import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const memoryCache = new Map<string, string>();

export async function resolveMediaUrls(obj: any): Promise<any> {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    if (obj.startsWith('/api/media/')) {
      const mediaId = obj.split('/api/media/')[1];
      if (mediaId) {
        if (memoryCache.has(mediaId)) {
          return memoryCache.get(mediaId);
        }
        try {
          const mediaSnap = await getDoc(doc(db, 'media', mediaId));
          if (mediaSnap.exists()) {
            const mediaData = mediaSnap.data();
            if (mediaData.url) {
              memoryCache.set(mediaId, mediaData.url);
              return mediaData.url;
            }
          }
        } catch(e) {}
      }
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(item => resolveMediaUrls(item)));
  }
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = await resolveMediaUrls(obj[key]);
    }
    return newObj;
  }
  return obj;
}
