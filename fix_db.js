import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

const serviceAccount = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

async function fix() {
  const pages = await db.collection('pages').get();
  let updated = 0;
  for (const doc of pages.docs) {
    const data = doc.data();
    if (data.blocks) {
      let changed = false;
      data.blocks.forEach(block => {
        if (block.type === 'menu_calendar' && block.days) {
          block.days.forEach(day => {
            if (day.isClosed) {
              day.isClosed = false;
              changed = true;
            }
          });
        }
      });
      if (changed) {
        await doc.ref.update({ blocks: data.blocks });
        updated++;
      }
    }
  }
  console.log('Fixed', updated, 'pages');
}
fix().catch(console.error);
