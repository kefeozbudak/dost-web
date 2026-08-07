import re

with open("src/admin/hubs/PagesCenter.tsx", "r") as f:
    c = f.read()

seed_patch = """
  // Auto-seed lgs-puan-hesaplama if missing
  useEffect(() => {
    const seedLgs = async () => {
      try {
        const docRef = doc(db, 'pages', 'lgs-puan-hesaplama');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || docSnap.data().isDeleted) {
          const { defaultLgsCalculatorData } = await import('../../lib/defaultData');
          await setDoc(docRef, {
            title: 'LGS Puan Hesaplama Modülü',
            path: '/lgs-puan-hesaplama',
            isDeleted: false,
            isHidden: false,
            blocks: defaultLgsCalculatorData,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }, { merge: true });
          fetchPages();
        }
      } catch (e) {
        console.error("Auto-seed error:", e);
      }
    };
    seedLgs();
  }, []);
"""

c = c.replace("  // Auto-seed kayit-fiyatlari if missing", seed_patch + "\n  // Auto-seed kayit-fiyatlari if missing")

with open("src/admin/hubs/PagesCenter.tsx", "w") as f:
    f.write(c)
