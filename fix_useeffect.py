import re

with open('src/components/MediaPickerModal.tsx', 'r') as f:
    code = f.read()

useeffect_regex = re.compile(r"useEffect\(\(\) => \{\s*if \(isOpen\) \{\s*setErrorMsg\(null\);\s*const fetchMedia = async \(\) => \{\s*setLoading\(true\);\s*try \{\s*const q = query\(collection\(db, 'media'\), orderBy\('createdAt', 'desc'\), limit\(30\)\);\s*const snapshot = await getDocs\(q\);\s*const items = snapshot\.docs\.map\(doc => \(\{\s*id: doc\.id,\s*\.\.\.doc\.data\(\),\s*serveUrl: `/api/media/\$\{doc\.id\}`\s*\}\)\);\s*setMediaItems\(items\);\s*\} catch \(err\) \{\s*console\.error\(\"Error fetching media\", err\);\s*\} finally \{\s*setLoading\(false\);\s*\}\s*\};\s*fetchMedia\(\);\s*\}\s*\}, \[isOpen\]\);")

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

print("Fixed useEffect!")
