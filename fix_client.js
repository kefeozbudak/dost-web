import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

// Get config from firebase.ts
import fs from 'fs';
const configContent = fs.readFileSync('src/lib/firebase.ts', 'utf8');
const match = configContent.match(/const firebaseConfig = ({[\s\S]*?});/);
if (!match) {
  console.error("Config not found");
  process.exit(1);
}

const config = eval("(" + match[1] + ")");
const app = initializeApp(config);
const db = getFirestore(app);

async function fix() {
  try {
    const pDoc = await getDoc(doc(db, 'pages', 'yemek-menusu'));
    if (pDoc.exists()) {
      const data = pDoc.data();
      let changed = false;
      if (data.blocks) {
        data.blocks.forEach(b => {
          if (b.type === 'menu_calendar' && b.days) {
            b.days.forEach(d => {
              if (d.isClosed) {
                d.isClosed = false;
                changed = true;
              }
            });
          }
        });
      }
      if (changed) {
        await updateDoc(doc(db, 'pages', 'yemek-menusu'), { blocks: data.blocks });
        console.log("DB FIXED SUCCESSFULLY!");
      } else {
        console.log("No changes needed in DB.");
      }
    } else {
      console.log("Page not found");
    }
  } catch (e) {
    console.error("Error updating DB:", e);
  }
  process.exit(0);
}

fix();
