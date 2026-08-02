import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  const ref = doc(db, "pages", "home");
  const snap = await getDoc(ref);
  const data = snap.data();
  console.log("Blocks length before:", data.blocks.length);
  
  if (data.blocks[0]) {
    data.blocks[0].title = "TEST UPDATE";
  }

  await setDoc(ref, data);
  console.log("Saved.");

  const snap2 = await getDoc(ref);
  console.log("Blocks length after:", snap2.data().blocks.length);
  console.log("Title after:", snap2.data().blocks[0].title);
  process.exit(0);
}
test();
