import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const pagesSnap = await getDocs(collection(db, "pages"));
  for (const pageDoc of pagesSnap.docs) {
    if (pageDoc.id === "home") {
        let data = JSON.stringify(pageDoc.data());
        console.log(data.match(/\/api\/media\/[a-zA-Z0-9_-]+/g));
    }
  }
  process.exit(0);
}
run();
