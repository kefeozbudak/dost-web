import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const formsRef = collection(db, 'forms');
  const q = query(formsRef, orderBy('createdAt', 'desc'), limit(5));
  const snapshot = await getDocs(q);
  
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`Type: ${data.type}`);
    console.log(`CreatedAt: ${data.createdAt}`);
    console.log(`Data keys: ${Object.keys(data.data || {}).join(', ')}`);
    
    // Check for uploaded files
    for (const key of Object.keys(data.data || {})) {
      if (data.data[key] && typeof data.data[key] === 'object' && data.data[key].isUploaded) {
         console.log(`File key: ${key}`);
         console.log(`File info: name=${data.data[key].name}, hasDataUrl=${!!data.data[key].dataUrl}`);
      }
    }
    console.log('---');
  });
  
  process.exit(0);
}

run().catch(console.error);
