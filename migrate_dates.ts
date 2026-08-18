import { db } from "./src/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const monthMap: Record<string, number> = {
  "ocak": 0, "şubat": 1, "subat": 1, "mart": 2, "nisan": 3,
  "mayıs": 4, "mayis": 4, "haziran": 5, "temmuz": 6, "ağustos": 7, "agustos": 7,
  "eylül": 8, "eylul": 8, "ekim": 9, "kasım": 10, "kasim": 10, "aralık": 11, "aralik": 11
};

async function run() {
  const pages = await getDocs(collection(db, 'pages'));
  let updatedCount = 0;
  
  for (const p of pages.docs) {
    const data = p.data();
    let changed = false;
    
    if (data.blocks) {
      data.blocks.forEach((b: any) => {
        if ((b.type === 'menu_calendar' || b.type === 'academic_calendar') && b.days) {
          const blockMonth = b.month || b.title || "";
          const lowerMonth = blockMonth.toLocaleLowerCase('tr-TR').replace(/i̇/g, 'i');
          let mIndex = new Date().getMonth();
          for (const [m, idx] of Object.entries(monthMap)) {
            if (lowerMonth.includes(m)) {
              mIndex = idx;
              break;
            }
          }
          const yearMatch = blockMonth.match(/\d{4}/);
          const year = yearMatch ? parseInt(yearMatch[0]) : new Date().getFullYear();
          
          b.days.forEach((d: any) => {
            if (d.date && !d.date.includes('-')) {
              const dayNum = parseInt(d.date.replace(/\D/g, ''));
              if (!isNaN(dayNum)) {
                d.date = `${year}-${String(mIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                changed = true;
              }
            }
          });
        }
      });
    }
    
    if (changed) {
      await updateDoc(doc(db, 'pages', p.id), { blocks: data.blocks });
      updatedCount++;
      console.log(`Updated page: ${p.id}`);
    }
  }
  
  console.log(`Migration complete. Updated ${updatedCount} pages.`);
  process.exit(0);
}
run();
