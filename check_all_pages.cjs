const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const snap = await getDocs(collection(db, 'pages'));
  snap.docs.forEach(d => {
    if (d.id.includes('is')) {
      console.log(d.id, d.data().blocks?.length);
    }
  });
  process.exit(0);
}
test();
