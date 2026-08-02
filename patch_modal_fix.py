import re

with open("src/components/MediaPickerModal.tsx", "r") as f:
    content = f.read()

old_code = """      const fetchMedia = async () => {
        setLoading(true);
        try {
          const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMediaItems(items);
        } catch (err) {
          console.error("Error fetching media", err);
        } finally {
          setLoading(false);
        }
      };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {"""

new_code = """      const fetchMedia = async () => {
        setLoading(true);
        try {
          const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setMediaItems(items);
        } catch (err) {
          console.error("Error fetching media", err);
        } finally {
          setLoading(false);
        }
      };
      fetchMedia();
    }
  }, [isOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {"""

content = content.replace(old_code, new_code)

with open("src/components/MediaPickerModal.tsx", "w") as f:
    f.write(content)
