const fs = require('fs');
const file = './src/admin/hubs/PagesCenter.tsx';
let content = fs.readFileSync(file, 'utf8');

const seedEduCode = `
  const seedEduSystemPage = async () => {
    try {
      const { defaultEgitimSistemiData } = await import('../../lib/defaultData');
      const docRef = doc(db, 'pages', 'egitim-sistemimiz');
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists() || !docSnap.data()?.blocks || docSnap.data().blocks.length === 0) {
        await setDoc(docRef, {
            title: "Eğitim Sistemimiz",
            path: "/egitim-sistemimiz",
            isDeleted: false,
            isHidden: false,
            blocks: defaultEgitimSistemiData,
            createdAt: Date.now()
        });
      }
    } catch (e) {
      console.error('Failed to seed edu system page', e);
    }
  };
`;

content = content.replace(
  `  const seedScholarshipConfirmationPage = async () => {`,
  seedEduCode + `\n  const seedScholarshipConfirmationPage = async () => {`
);

content = content.replace(
  `      await seedScholarshipConfirmationPage();`,
  `      await seedScholarshipConfirmationPage();\n      await seedEduSystemPage();`
);

fs.writeFileSync(file, content);
