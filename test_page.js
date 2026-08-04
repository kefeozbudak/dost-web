import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const pagesSnap = await getDocs(collection(db, "pages"));
  for (const pageDoc of pagesSnap.docs) {
    let data = JSON.stringify(pageDoc.data());
    if (data.includes("/api/media/")) {
      console.log("Found /api/media/ in", pageDoc.id);
    }
    if (data.includes("data:image/")) {
      console.log("Found data:image/ in", pageDoc.id);
    }
  }
  process.exit(0);
}
run();
