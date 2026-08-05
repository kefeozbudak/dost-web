const fs = require('fs');

let content = fs.readFileSync('src/admin/hubs/PagesCenter.tsx', 'utf8');

const seedCareerStr = `
  const seedCareerPage = async () => {
    try {
      const { defaultCareerPageData } = await import('../../lib/defaultData');
      const docRef = doc(db, 'pages', 'is-basvurusu');
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists() || !docSnap.data()?.blocks || docSnap.data().blocks.length === 0) {
        await setDoc(docRef, {
            title: "İş Başvurusu",
            path: "/is-basvurusu",
            isDeleted: false,
            isHidden: false,
            blocks: defaultCareerPageData,
            createdAt: Date.now()
        });
      }
    } catch (e) {
      console.error('Failed to seed career page', e);
    }
  };
`;

content = content.replace(
  /const fetchPages \= async \(\) \=\> \{/,
  seedCareerStr + '\n  const fetchPages = async () => {'
);

content = content.replace(
  /await seedEduSystemPage\(\);/,
  'await seedEduSystemPage();\n    await seedCareerPage();'
);

fs.writeFileSync('src/admin/hubs/PagesCenter.tsx', content);
