import { db } from "./src/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

async function run() {
  console.log("Fixing DB...");
  const pDoc = await getDoc(doc(db, 'pages', 'aylik-yemek-menusu'));
  if (pDoc.exists()) {
    const data = pDoc.data();
    let changed = false;
    if (data.blocks) {
      data.blocks.forEach((b: any) => {
        if (b.type === 'menu_calendar' && b.days) {
          b.days.forEach((d: any) => {
            if (d.isClosed) {
              d.isClosed = false;
              changed = true;
            }
          });
        }
      });
    }
    if (changed) {
      await updateDoc(doc(db, 'pages', 'aylik-yemek-menusu'), { blocks: data.blocks });
      console.log("DB FIXED SUCCESSFULLY!");
    } else {
      console.log("No changes needed in DB.");
    }
  } else {
    console.log("Page not found");
  }
  process.exit(0);
}
run();
