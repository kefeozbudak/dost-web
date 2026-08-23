import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function restore() {
  try {
    const backupData = JSON.parse(fs.readFileSync('firestore_backup.json', 'utf8'));
    let totalRestored = 0;
    
    for (const [colName, docs] of Object.entries(backupData)) {
      for (const [docId, docData] of Object.entries(docs)) {
        await setDoc(doc(db, colName, docId), docData);
        totalRestored++;
      }
      console.log(`Restored ${Object.keys(docs).length} documents to '${colName}'`);
    }
    
    console.log(`Restore complete! Total documents restored: ${totalRestored}`);
    process.exit(0);
  } catch (e) {
    console.error("Error during restore:", e);
    process.exit(1);
  }
}

restore();
