import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { defaultLgsCalculatorData } from './src/lib/defaultData';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

async function seed() {
  const docRef = doc(db, 'pages', 'lgs-puan-hesaplama');
  await setDoc(docRef, {
    title: 'LGS Puan Hesaplama Modülü',
    path: '/lgs-puan-hesaplama',
    isDeleted: false,
    isHidden: false,
    blocks: defaultLgsCalculatorData,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }, { merge: true });
  console.log("LGS page seeded successfully");
  process.exit(0);
}
seed().catch(e => { console.error(e); process.exit(1); });
