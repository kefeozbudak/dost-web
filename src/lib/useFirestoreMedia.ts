import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const mediaCache: Record<string, string> = {};

export function useFirestoreMedia(url: string | undefined): string | undefined {
  const [resolvedUrl, setResolvedUrl] = useState<string | undefined>(
    url?.startsWith('firestore-media:') ? undefined : url
  );

  useEffect(() => {
    if (!url) {
      setResolvedUrl(undefined);
      return;
    }

    if (url.startsWith('firestore-media:')) {
      const mediaId = url.split(':')[1];
      
      if (mediaCache[mediaId]) {
        setResolvedUrl(mediaCache[mediaId]);
        return;
      }

      const fetchMedia = async () => {
        try {
          const docRef = doc(db, 'media', mediaId);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.url) {
              mediaCache[mediaId] = data.url;
              setResolvedUrl(data.url);
            }
          }
        } catch (error) {
          console.error("Error fetching media from Firestore:", error);
        }
      };
      
      fetchMedia();
    } else if (url.startsWith('/api/media/')) {
        // Also support fetching legacy /api/media/ IDs from Firestore directly for static sites
        const mediaId = url.split('/api/media/')[1];
        if (mediaCache[mediaId]) {
          setResolvedUrl(mediaCache[mediaId]);
          return;
        }
  
        const fetchMedia = async () => {
          try {
            const docRef = doc(db, 'media', mediaId);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              const data = snap.data();
              if (data.url) {
                mediaCache[mediaId] = data.url;
                setResolvedUrl(data.url);
              }
            }
          } catch (error) {
            console.error("Error fetching media from Firestore:", error);
          }
        };
        fetchMedia();
    } else {
      setResolvedUrl(url);
    }
  }, [url]);

  return resolvedUrl;
}
