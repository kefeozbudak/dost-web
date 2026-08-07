import { db } from './src/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { defaultTuitionFeesData } from './src/lib/defaultData';

async function seed() {
  const docRef = doc(db, 'pages', 'kayit-fiyatlari');
  await setDoc(docRef, {
    title: 'Kayıt Fiyatları',
    path: '/kayit-fiyatlari',
    isDeleted: false,
    isHidden: false,
    blocks: defaultTuitionFeesData,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }, { merge: true });
  console.log("Seeded successfully");
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
