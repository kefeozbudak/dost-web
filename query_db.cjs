const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const fs = require('fs');
const firebaseConfig = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf-8'));

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const bDoc = await getDoc(doc(db, "pages", "bursluluk-basvuru-formu"));
  if (bDoc.exists()) {
    console.log("BURSLULUK PAGE BLOCKS:");
    console.log(JSON.stringify(bDoc.data().blocks, null, 2));
  } else {
    console.log("BURSLULUK PAGE NOT FOUND IN DB");
  }

  const iDoc = await getDoc(doc(db, "pages", "is-basvurusu"));
  if (iDoc.exists()) {
    console.log("IS BASVURUSU PAGE BLOCKS:");
    console.log(JSON.stringify(iDoc.data().blocks, null, 2));
  } else {
    console.log("IS BASVURUSU PAGE NOT FOUND IN DB");
  }
  process.exit(0);
}

check();
