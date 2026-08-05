const fs = require('fs');
let file = fs.readFileSync('./src/admin/AdminLayout.tsx', 'utf8');

const targetSeedStr = `        if (!docSnap.exists() || !docSnap.data()?.blocks) {
          await setDoc(docRef, {
            title: "Kulüp Kayıt Formu",
            path: "/kulup-kayit-formu",
            blocks: defaultBlocks,
            isDeleted: false,
            isHidden: false,
            updatedAt: Date.now()
          }, { merge: true });
        }`;

const insertStr = `
        const careerRef = doc(db, 'pages', 'is-basvuru-formu');
        const careerSnap = await getDoc(careerRef);
        if (!careerSnap.exists() || !careerSnap.data()?.blocks) {
          await setDoc(careerRef, {
            title: "İş Başvuru Formu",
            path: "/is-basvuru-formu",
            blocks: [
              { type: 'career_hero', title: "Dost Koleji'nde Kariyer" },
              { type: 'career_benefits', title: "Neden Bize Katılmalısınız?" },
              { type: 'career_application', title: "Mevcut Açık Pozisyonlar" }
            ],
            isDeleted: false,
            isHidden: false,
            updatedAt: Date.now()
          }, { merge: true });
        }`;

file = file.replace(targetSeedStr, targetSeedStr + insertStr);
fs.writeFileSync('./src/admin/AdminLayout.tsx', file);
