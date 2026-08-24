import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
// Specifically force the new DB ID
const db = getFirestore(app, "dost-koleji-prod-db");

async function check() {
  try {
    const snap = await getDocs(collection(db, 'pages'));
    console.log("SUCCESS. Pages count:", snap.size);
    process.exit(0);
  } catch (e) {
    console.error("FAILED. Error:", e);
    process.exit(1);
  }
}
check();
