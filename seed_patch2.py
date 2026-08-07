import re

with open("src/admin/AdminLayout.tsx", "r") as f:
    c = f.read()

patch = """
  // Auto-seed kayit-fiyatlari
  useEffect(() => {
    const seedKayit = async () => {
      try {
        const docRef = doc(db, 'pages', 'kayit-fiyatlari');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || docSnap.data().isDeleted) {
          const { defaultTuitionFeesData } = await import('../lib/defaultData');
          await setDoc(docRef, {
            title: 'Kayıt Fiyatları',
            path: '/kayit-fiyatlari',
            isDeleted: false,
            isHidden: false,
            blocks: defaultTuitionFeesData,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Auto-seed error:", e);
      }
    };
    seedKayit();
  }, []);
"""

c = c.replace("  useEffect(() => {\n    const seedPages = async () => {", patch + "\n  useEffect(() => {\n    const seedPages = async () => {")

with open("src/admin/AdminLayout.tsx", "w") as f:
    f.write(c)
