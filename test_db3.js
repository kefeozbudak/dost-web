import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function test() {
  const ref = doc(db, "pages", "home");
  const snap = await getDoc(ref);
  const data = snap.data();
  console.log("Original Title:", data.title);
  
  // Modify it
  data.title = "Ana Sayfa - Changed";
  await setDoc(ref, data);
  console.log("Saved.");

  // Read it back
  const snap2 = await getDoc(ref);
  console.log("New Title:", snap2.data().title);
  
  // Restore
  data.title = "Ana Sayfa";
  await setDoc(ref, data);

  process.exit(0);
}
test();
