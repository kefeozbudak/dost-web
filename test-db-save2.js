import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import config from './firebase-applet-config.json' assert { type: 'json' };

const app = initializeApp(config);
const db = getFirestore(app);

async function test() {
  const docRef = doc(db, 'pages', 'home');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    console.log('Exists! Blocks length:', snap.data().blocks?.length);
    console.log('Features items:', snap.data().blocks?.find(b => b.type === 'features')?.items);
    console.log('Education levels items:', snap.data().blocks?.find(b => b.type === 'education_levels')?.items);
  } else {
    console.log('Does not exist');
  }
  process.exit(0);
}

test().catch(console.error);
