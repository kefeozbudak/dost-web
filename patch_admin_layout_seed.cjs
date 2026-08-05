const fs = require('fs');
let file = fs.readFileSync('./src/admin/AdminLayout.tsx', 'utf8');

const importTarget = `import { defaultPreRegistrationData } from '../lib/defaultData';`;
const importReplacement = `import { defaultPreRegistrationData, defaultEgitimSistemiData } from '../lib/defaultData';`;

file = file.replace(importTarget, importReplacement);

const seedTarget = `        for (const item of pagesToSeed) {
          const pageRef = doc(db, 'pages', item.id);
          const pageSnap = await getDoc(pageRef);
          if (!pageSnap.exists()) {
            await setDoc(pageRef, {
              title: item.title,
              path: item.path,
              isDeleted: false,
              isHidden: false,
              blocks: [],
              createdAt: Date.now()
            });
          }
        }`;

const seedReplacement = `        for (const item of pagesToSeed) {
          const pageRef = doc(db, 'pages', item.id);
          const pageSnap = await getDoc(pageRef);
          
          let initialBlocks = [];
          if (item.id === 'egitim-sistemimiz') {
             initialBlocks = defaultEgitimSistemiData;
          }

          if (!pageSnap.exists()) {
            await setDoc(pageRef, {
              title: item.title,
              path: item.path,
              isDeleted: false,
              isHidden: false,
              blocks: initialBlocks,
              createdAt: Date.now()
            });
          } else if (item.id === 'egitim-sistemimiz') {
            const data = pageSnap.data();
            if (!data.blocks || data.blocks.length === 0) {
              await setDoc(pageRef, { blocks: initialBlocks }, { merge: true });
            }
          }
        }`;

file = file.replace(seedTarget, seedReplacement);
fs.writeFileSync('./src/admin/AdminLayout.tsx', file);
