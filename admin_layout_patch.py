import re

with open("src/admin/AdminLayout.tsx", "r") as f:
    c = f.read()

# Add to FORM_SLUGS
c = c.replace(
    "{ id: 'bursluluk-basvuru-onay', title: 'Bursluluk Sınav Başvuru Onayı', path: '/bursluluk-basvuru-onay' },",
    "{ id: 'bursluluk-basvuru-onay', title: 'Bursluluk Sınav Başvuru Onayı', path: '/bursluluk-basvuru-onay' },\n    { id: 'lgs-puan-hesaplama', title: 'LGS Puan Hesaplama Modülü', path: '/lgs-puan-hesaplama' },"
)

# Add auto-seed
seed_patch = """
  // Auto-seed lgs-puan-hesaplama
  useEffect(() => {
    const seedLgs = async () => {
      try {
        const docRef = doc(db, 'pages', 'lgs-puan-hesaplama');
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists() || docSnap.data().isDeleted) {
          const { defaultLgsCalculatorData } = await import('../lib/defaultData');
          await setDoc(docRef, {
            title: 'LGS Puan Hesaplama Modülü',
            path: '/lgs-puan-hesaplama',
            isDeleted: false,
            isHidden: false,
            blocks: defaultLgsCalculatorData,
            createdAt: Date.now(),
            updatedAt: Date.now()
          }, { merge: true });
        }
      } catch (e) {
        console.error("Auto-seed error:", e);
      }
    };
    seedLgs();
  }, []);
"""

c = c.replace("  // Auto-seed kayit-fiyatlari", seed_patch + "\n  // Auto-seed kayit-fiyatlari")

with open("src/admin/AdminLayout.tsx", "w") as f:
    f.write(c)
