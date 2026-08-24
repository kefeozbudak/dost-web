import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  try {
    const snap = await getDocs(collection(db, 'pages'));
    console.log("Pages count in new db:", snap.size);
    if (snap.size > 0) {
      console.log("Docs:");
      snap.forEach(doc => console.log(doc.id, doc.data().title, doc.data().blocks?.length));
    }
  } catch (e) {
    console.error("Error:", e);
  }
}
check();
