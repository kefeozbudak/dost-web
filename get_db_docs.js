import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function check() {
  try {
    const snap = await getDocs(collection(db, 'pages'));
    console.log("Pages count:", snap.size);
    snap.forEach(doc => {
      const data = doc.data();
      console.log(`Doc ID: ${doc.id}, Blocks count: ${data.blocks ? data.blocks.length : 0}, isDeleted: ${data.isDeleted}`);
    });
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}
check();
