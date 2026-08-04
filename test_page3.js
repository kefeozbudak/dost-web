import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const ids = ['udBxP9zxdkTJMGMVR7hG', 'NkAh9tBvF0KjPyFI8Zi7', 'zTlkJa1Fhums98woUzUh'];
  for (const id of ids) {
     const snap = await getDoc(doc(db, "media", id));
     console.log("Media", id, "exists:", snap.exists());
  }
  process.exit(0);
}
run();
