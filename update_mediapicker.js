const fs = require('fs');
let code = fs.readFileSync('src/components/MediaPickerModal.tsx', 'utf8');

// Add onSnapshot to imports if not there
if (!code.includes('onSnapshot')) {
    code = code.replace(/getDocs/, 'getDocs, onSnapshot');
}

// Replace useEffect
const oldUseEffect = `  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      const fetchMedia = async () => {
        setLoading(true);
        try {
          const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(30));
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({ 
             id: doc.id, 
             ...doc.data(),
            serveUrl: \`/api/media/\${doc.id}\`
          }));
          setMediaItems(items);
        } catch (err) {
          console.error("Error fetching media", err);
        } finally {
          setLoading(false);
        }
      };
      fetchMedia();
    }
  }, [isOpen]);`;

const newUseEffect = `  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setLoading(true);
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(30));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ 
           id: doc.id, 
           ...doc.data(),
          serveUrl: \`/api/media/\${doc.id}\`
        }));
        setMediaItems(items);
        setLoading(false);
      }, (err) => {
        console.error("Error fetching media", err);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isOpen]);`;

code = code.replace(oldUseEffect, newUseEffect);

// Replace handleFileUpload refetch
const oldRefetch = `      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(30));
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ 
         id: doc.id, 
         ...doc.data(),
        serveUrl: \`/api/media/\${doc.id}\`
      }));
      setMediaItems(items);`;

code = code.replace(oldRefetch, '');

fs.writeFileSync('src/components/MediaPickerModal.tsx', code);
console.log('MediaPickerModal.tsx updated');
