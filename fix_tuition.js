import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const configStr = fs.readFileSync("firebase-applet-config.json", "utf8");
const config = JSON.parse(configStr);

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  console.log("Checking all pages for duplicate tuition_fees_hero blocks...");
  const pagesRef = collection(db, 'pages');
  const snap = await getDocs(pagesRef);
  let migratedCount = 0;
  for (const pageDoc of snap.docs) {
    const data = pageDoc.data();
    if (data.blocks) {
      let heroCount = 0;
      let changed = false;
      const newBlocks = [];
      for (const block of data.blocks) {
        if (block.type === 'tuition_fees_hero') {
          heroCount++;
          if (heroCount === 1) {
            newBlocks.push(block); // keep the first one
          } else {
            console.log(`Removing extra tuition_fees_hero from page ${pageDoc.id}`);
            changed = true; // remove the duplicate
          }
        } else {
          newBlocks.push(block);
        }
      }
      if (changed) {
        console.log(`Saving cleaned page: ${pageDoc.id}`);
        await setDoc(doc(db, 'pages', pageDoc.id), { ...data, blocks: newBlocks });
        migratedCount++;
      }
    }
  }
  console.log("Cleanup complete. Cleaned: " + migratedCount);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
