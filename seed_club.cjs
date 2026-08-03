const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/PagesCenter.tsx', 'utf8');

const target = `  const fetchPages = async () => {`;
const replacement = `
  const seedClubPage = async () => {
    try {
      const docRef = doc(db, 'pages', 'kulup-kayit-formu');
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        await setDoc(docRef, {
            title: "Kulüp Kayıt Formu",
            path: "/kulup-kayit-formu",
            isDeleted: false,
            isHidden: false,
            blocks: [
                {
                    type: "club_registration_form",
                    titlePart1: "Dost Koleji",
                    titlePart2: "Kulüp Kayıt",
                    subtitle: "Lütfen Formu Eksiksiz Doldurunuz.",
                }
            ],
            createdAt: Date.now()
        });
      }
    } catch (e) {
      console.error('Failed to seed club page', e);
    }
  };

  const fetchPages = async () => {
    await seedClubPage();`;

if (code.indexOf('seedClubPage') === -1) {
    code = code.replace(target, replacement);
    code = code.replace(`import { collection, query, orderBy, getDocs, doc, setDoc } from 'firebase/firestore';`, `import { collection, query, orderBy, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';`);
    fs.writeFileSync('src/admin/hubs/PagesCenter.tsx', code);
    console.log('Injected seeder');
} else {
    console.log('Already injected');
}
