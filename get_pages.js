import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const querySnapshot = await getDocs(collection(db, "pages"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if ((data.slug && (data.slug.includes("eryaman") || data.slug.includes("umitkoy") || data.slug.includes("oran") || data.slug.includes("kampusu"))) || 
        (data.title && (data.title.toLowerCase().includes("eryaman") || data.title.toLowerCase().includes("ümitköy") || data.title.toLowerCase().includes("oran") || data.title.toLowerCase().includes("kampüs")))) {
       console.log(data.title);
       console.log(data.blocks?.map(b => b.type));
    }
  });
  process.exit(0);
}
run();
