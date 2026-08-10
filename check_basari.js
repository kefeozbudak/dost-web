import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const docSnap = await getDoc(doc(db, 'pages', 'basarilarimiz'));
  if (docSnap.exists()) {
    const data = docSnap.data();
    console.log(JSON.stringify(data.blocks, null, 2));
  } else {
    console.log("No basarilarimiz page found.");
  }
  process.exit(0);
}
run().catch(console.error);
