import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const querySnapshot = await getDocs(collection(db, 'pages'));
  let foundOnKayit = false;
  for (const docSnap of querySnapshot.docs) {
    const data = docSnap.data();
    if (data.slug === 'on-kayit') {
      foundOnKayit = true;
      let changed = false;
      const newBlocks = data.blocks.map(b => {
        if (b.type === 'pre_registration_form' && b.inputs) {
          b.inputs.forEach(inp => {
            if (inp.name === 'grade') {
               inp.options = 'Okul Öncesi 4 Yaş, Okul Öncesi 5 Yaş, Okul Öncesi 6 Yaş, 1. Sınıf, 2. Sınıf, 3. Sınıf, 4. Sınıf, 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf, 9. Sınıf, 10. Sınıf, 11. Sınıf';
               changed = true;
            }
          });
        }
        return b;
      });
      if (changed) {
        await updateDoc(docSnap.ref, { blocks: newBlocks });
        console.log('Updated on-kayit page in DB');
      } else {
        console.log('on-kayit page does not need update or has no inputs');
      }
    }
  }
  if (!foundOnKayit) console.log("on-kayit not found in db");
  process.exit(0);
}
run().catch(console.error);
