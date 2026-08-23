import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const collectionsToBackup = [
  'pages', 'settings', 'users', 'popups', 'forms',
  'lgs_results', 'clubs', 'scholarships', 'backups', 'media', 'analytics'
];

async function backup() {
  const backupData = {};
  let totalDocs = 0;
  for (const colName of collectionsToBackup) {
    try {
      const snap = await getDocs(collection(db, colName));
      backupData[colName] = {};
      snap.forEach(doc => {
        backupData[colName][doc.id] = doc.data();
      });
      console.log(`Backed up ${snap.size} documents from '${colName}'`);
      totalDocs += snap.size;
    } catch (e) {
      console.error(`Error backing up '${colName}':`, e.message);
    }
  }
  fs.writeFileSync('firestore_backup.json', JSON.stringify(backupData, null, 2));
  console.log(`Backup complete! Total documents saved: ${totalDocs}`);
  process.exit(0);
}

backup();
