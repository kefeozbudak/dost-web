import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const snapshot = await getDocs(collection(db, 'pages'));
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    console.log(`Slug: ${data.slug}, Path: ${data.path}, Title: ${data.title}`);
    console.log(`Blocks: ${data.blocks?.map(b => b.type).join(', ')}`);
    console.log('---');
  });
}

run().catch(console.error);
