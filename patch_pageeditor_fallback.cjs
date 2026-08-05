const fs = require('fs');
let file = fs.readFileSync('./src/admin/PageEditor.tsx', 'utf8');

const targetFallbackStr = `        if (docSnap.exists()) {
          const data = docSnap.data(); 
          data.blocks = data.blocks?.filter((b: any) => b.type !== "header" && b.type !== "footer");`;

const newFallbackStr = `        if (docSnap.exists() && docSnap.data().blocks && docSnap.data().blocks.length > 0) {
          const data = docSnap.data(); 
          data.blocks = data.blocks?.filter((b: any) => b.type !== "header" && b.type !== "footer");`;

const fallbackElseIf = `        } else if (pageId === 'is-basvuru-formu') {
          const defaultData = {
            title: 'İş Başvuru Formu',
            path: '/is-basvuru-formu',
            blocks: [
              { type: 'career_hero', title: "Dost Koleji'nde Kariyer" },
              { type: 'career_benefits', title: "Neden Bize Katılmalısınız?" },
              { type: 'career_application', title: "Mevcut Açık Pozisyonlar" }
            ]
          };
          setPageData(defaultData);
        } else if (pageId === 'home') {`;

file = file.replace(targetFallbackStr, newFallbackStr);
file = file.replace(/\} else if \(pageId === 'home'\) \{/, fallbackElseIf);

fs.writeFileSync('./src/admin/PageEditor.tsx', file);
