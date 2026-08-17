const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  try {
    const snap = await getDoc(doc(db, 'pages', 'is-basvurusu'));
    if (snap.exists()) {
      console.log("is-basvurusu blocks:", JSON.stringify(snap.data().blocks, null, 2));
    } else {
      console.log("is-basvurusu not found");
    }
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
test();
