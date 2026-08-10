import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const q = query(collection(db, 'pages'), where('slug', '==', 'basarilarimiz'));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    console.log("No page found with slug 'basarilarimiz'");
    return;
  }
  const page = snapshot.docs[0].data();
  console.log("Blocks found for basarilarimiz:", page.blocks.map(b => b.type));
}

run().catch(console.error);
