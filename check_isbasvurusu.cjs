const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const snap = await getDoc(doc(db, 'pages', 'is-basvurusu'));
  if (snap.exists()) {
    console.log("is-basvurusu EXISTS! Blocks:", snap.data().blocks?.length);
    console.log("data:", JSON.stringify(snap.data(), null, 2));
  } else {
    console.log("is-basvurusu does not exist in target DB");
  }
  process.exit(0);
}
test();
