const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc } = require('firebase/firestore');

const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  try {
    const q = collection(db, 'pages');
    const snap = await getDocs(q);
    console.log("Success! Found pages:", snap.docs.length);
  } catch (err) {
    console.error("Error connecting to Firestore:", err);
  }
  process.exit(0);
}
test();
