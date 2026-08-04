import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const docRef = doc(db, "media", "zTlkJa1Fhums98woUzUh");
  const snap = await getDoc(docRef);
  console.log("Exists:", snap.exists());
  if (snap.exists()) {
    const data = snap.data();
    console.log("URL prefix:", data.url ? data.url.substring(0, 50) : null);
  }
  process.exit(0);
}
run();
