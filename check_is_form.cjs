const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const snap = await getDoc(doc(db, 'pages', 'is-basvuru-formu'));
  if (snap.exists()) {
    console.log(JSON.stringify(snap.data(), null, 2));
  }
  process.exit(0);
}
test();
