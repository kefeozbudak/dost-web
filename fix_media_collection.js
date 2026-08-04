import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const storage = getStorage(app);

async function run() {
  console.log("Fixing media URLs...");
  const mediaSnap = await getDocs(collection(db, "media"));
  for (const mediaDoc of mediaSnap.docs) {
    let mediaData = mediaDoc.data();
    if (mediaData.url && mediaData.url.startsWith("data:image")) {
       console.log("Fixing media collection item", mediaDoc.id);
       try {
          const storageRef = ref(storage, `media/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`);
          await uploadString(storageRef, mediaData.url, 'data_url');
          const publicUrl = await getDownloadURL(storageRef);
          // Update media doc to have public URL so future queries are fast
          await updateDoc(doc(db, "media", mediaDoc.id), { url: publicUrl });
       } catch(e) {
          console.log("Storage upload failed, keeping base64");
       }
    }
  }
  console.log("Done");
  process.exit(0);
}
run();
