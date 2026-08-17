const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const snap = await getDoc(doc(db, 'pages', 'is-basvurusu'));
  if (snap.exists()) {
    console.log("EXISTS!", snap.data().updatedAt);
  } else {
    console.log("DOES NOT EXIST");
  }
  process.exit(0);
}
test();
