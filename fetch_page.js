import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('/tmp/firebase-service-account.json', 'utf8'));

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

async function run() {
  const snapshot = await db.collection('pages').where('slug', '==', 'basarilarimiz').get();
  if (snapshot.empty) {
    console.log("No page found");
    return;
  }
  const page = snapshot.docs[0].data();
  console.log(JSON.stringify(page.blocks.map(b => b.type), null, 2));
}

run().catch(console.error);
