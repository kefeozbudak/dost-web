import re

with open('src/components/MediaPickerModal.tsx', 'r') as f:
    code = f.read()

# Replace the entire useEffect block
useeffect_regex = re.compile(r"  useEffect\(\(\) => \{[\s\S]*?\}, \[isOpen\]\);")

new_useeffect = """  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setLoading(true);
      const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'), limit(30));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ 
           id: doc.id, 
           ...doc.data(),
          serveUrl: `/api/media/${doc.id}`
        }));
        setMediaItems(items);
        setLoading(false);
      }, (err) => {
        console.error("Error fetching media", err);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [isOpen]);"""

code = useeffect_regex.sub(new_useeffect, code)

with open('src/components/MediaPickerModal.tsx', 'w') as f:
    f.write(code)

print("Fixed useEffect again!")
