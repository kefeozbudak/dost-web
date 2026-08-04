import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const pagesSnap = await getDocs(collection(db, "pages"));
  for (const pageDoc of pagesSnap.docs) {
     const data = JSON.stringify(pageDoc.data());
     const matches = data.match(/"image":"([^"]+)"/g);
     if (matches) {
       console.log("Page", pageDoc.id, ":");
       for (const m of matches) {
         console.log("  ", m);
       }
     }
  }
  process.exit(0);
}
run();
