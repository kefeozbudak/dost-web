import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  const d = await getDoc(doc(db, "pages", "home"));
  if (d.exists()) {
    console.log(JSON.stringify(d.data().blocks, null, 2).substring(0, 500));
  } else {
    console.log("No home page");
  }
  process.exit(0);
}
test();
