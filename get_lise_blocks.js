import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
    const d = await getDoc(doc(db, 'pages', 'lise'));
    if (d.exists()) {
        console.log(JSON.stringify(d.data().blocks, null, 2));
    }
    process.exit(0);
}
run();
