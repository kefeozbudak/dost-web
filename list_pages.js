import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const snapshot = await getDocs(collection(db, "pages"));
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.blocks) {
      data.blocks.forEach((b, i) => {
        if (b.title && (b.title.toLowerCase().includes("müdür") || b.title.toLowerCase().includes("yardımcı"))) {
           console.log("Page:", data.title, "| Block type:", b.type, "| Block title:", b.title);
        }
      });
    }
  });
}
run().catch(console.error);
