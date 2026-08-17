const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc } = require('firebase/firestore');

const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const q = collection(db, 'pages');
    const snap = await getDocs(q);
    snap.forEach(d => {
      if (d.id.includes('basvuru') || d.id.includes('career')) {
        console.log(d.id, "->", d.data().blocks ? d.data().blocks.length : 'no blocks');
      }
    });
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}
test();
