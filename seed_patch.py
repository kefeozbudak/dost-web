import re

with open("src/admin/hubs/PagesCenter.tsx", "r") as f:
    c = f.read()

patch = """
  // Auto-seed kayit-fiyatlari if missing
  useEffect(() => {
    const seedKayit = async () => {
      try {
        const docRef = doc(db, 'pages', 'kayit-fiyatlari');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || docSnap.data().isDeleted) {
          const { defaultTuitionFeesData } = await import('../../lib/defaultData');
          await setDoc(docRef, {
            title: 'Kayıt Fiyatları',
            path: '/kayit-fiyatlari',
            isDeleted: false,
            isHidden: false,
            blocks: defaultTuitionFeesData,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }, { merge: true });
          fetchPages();
        }
      } catch (e) {
        console.error("Auto-seed error:", e);
      }
    };
    seedKayit();
  }, []);
"""

c = c.replace("  useEffect(() => {\n    fetchPages();\n  }, []);", "  useEffect(() => {\n    fetchPages();\n  }, []);\n" + patch)

with open("src/admin/hubs/PagesCenter.tsx", "w") as f:
    f.write(c)
