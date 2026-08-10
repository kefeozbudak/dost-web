import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const pages = ['anaokulu', 'ilkokul', 'ortaokul', 'lise'];
  for (const p of pages) {
    const docSnap = await getDoc(doc(db, 'pages', p));
    if (docSnap.exists()) {
      const data = docSnap.data();
      const hero = data.blocks.find(b => b.type.includes('hero'));
      if (hero) {
         console.log(p, "Hero type:", hero.type, "Title:", hero.title, "Part1:", hero.titlePart1, "Part2:", hero.titlePart2);
      } else {
         console.log(p, "No hero block found.");
      }
    }
  }
  process.exit(0);
}
run().catch(console.error);
