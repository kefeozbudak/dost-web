const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const snap = await getDocs(collection(db, 'pages'));
  let recent = [];
  snap.docs.forEach(d => {
    recent.push({ id: d.id, updated: d.data().updatedAt || d.data().createdAt });
  });
  recent.sort((a, b) => b.updated - a.updated);
  console.log(recent.slice(0, 5));
  process.exit(0);
}
test();
