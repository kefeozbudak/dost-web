import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const docRef = doc(db, "pages", "home");
  const snap = await getDoc(docRef);
  if (snap.exists()) {
     const data = snap.data();
     const campuses = data.blocks?.find(b => b.type === 'campuses');
     if (campuses) {
       console.log("Campuses items:");
       campuses.items.forEach(i => console.log(i.title, i.image));
     }
  }
  process.exit(0);
}
run();
