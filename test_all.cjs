const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const snap = await getDocs(collection(db, 'pages'));
  snap.docs.forEach(doc => {
    const blocks = doc.data().blocks;
    if (blocks && blocks.length > 0) {
      console.log(`Page: ${doc.id}, blocks: ${blocks.length}`);
      blocks.forEach(b => {
        if (b.image && b.image.includes('firebasestorage')) {
          console.log(`  - Block ${b.type} has firebasestorage image`);
        }
        if (b.items) {
          b.items.forEach(i => {
            if (i.image && i.image.includes('firebasestorage')) {
              console.log(`  - Block ${b.type} item has firebasestorage image`);
            }
          });
        }
      });
    }
  });
  process.exit(0);
}
test();
