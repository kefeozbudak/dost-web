import fs from 'fs';
import path from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, getDocs, collection } from 'firebase/firestore';

const configPath = path.resolve(process.cwd(), 'firebase-applet-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const firebaseApp = initializeApp(config);
const db = getFirestore(firebaseApp, config.firestoreDatabaseId);

async function run() {
  const pagesCol = collection(db, 'pages');
  const snap = await getDocs(pagesCol);
  console.log("Pages in Firestore:");
  snap.docs.forEach(docSnap => {
    const data = docSnap.data();
    console.log(`- ID: ${docSnap.id}, Title: ${data.title}`);
  });
}
run().catch(console.error);
