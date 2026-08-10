import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const config = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const docSnap = await getDoc(doc(db, 'pages', 'basarilarimiz'));
  if (docSnap.exists()) {
    let data = docSnap.data();
    let modified = false;
    
    data.blocks = data.blocks.map(block => {
      if (block.type === 'bento_academic') {
        block.items = block.items.map(item => {
          let newItem = { ...item };
          
          if (newItem.stats && newItem.stats.length > 0) {
            newItem.stat1Label = newItem.stats[0]?.label || "";
            newItem.stat1Value = newItem.stats[0]?.value || "";
            newItem.stat2Label = newItem.stats[1]?.label || "";
            newItem.stat2Value = newItem.stats[1]?.value || "";
            delete newItem.stats;
            modified = true;
          }
          
          if (newItem.list && newItem.list.length > 0) {
            newItem.listString = newItem.list.join('\n');
            delete newItem.list;
            modified = true;
          }
          
          return newItem;
        });
      }
      return block;
    });
    
    if (modified) {
      await setDoc(doc(db, 'pages', 'basarilarimiz'), data);
      console.log("Migrated bento_academic stats and list.");
    } else {
      console.log("No bento_academic migration needed.");
    }
  }
  process.exit(0);
}
run().catch(console.error);
