import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function check() {
  const pDoc = await getDoc(doc(db, 'pages', 'aylik-yemek-menusu'));
  if (pDoc.exists()) {
    const data = pDoc.data();
    data.blocks.forEach(b => {
      if (b.type === 'menu_calendar') {
        console.log("Title:", b.title);
        console.log("First 3 days:", JSON.stringify(b.days.slice(0,3), null, 2));
      }
    });
  }
  process.exit(0);
}
check();
