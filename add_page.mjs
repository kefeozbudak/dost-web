import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  await setDoc(doc(db, 'pages', 'hizli-iletisim'), {
    title: 'Hızlı İletişim',
    slug: 'hizli-iletisim',
    createdAt: Date.now(),
    isDeleted: false,
    isHidden: false,
    blocks: [
      {
        id: "block_qcf_1",
        type: "quick_contact_form",
        title: "Hızlı İletişim Formu",
        styles: {
            container: { backgroundColor: "#f8fafc", paddingTop: "40px", paddingBottom: "80px" }
        }
      }
    ]
  });
  console.log("Page seeded!");
  process.exit(0);
}
run();
