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
  const pagesSnap = await getDocs(collection(db, "pages"));
  for (const pageDoc of pagesSnap.docs) {
    let data = pageDoc.data();
    let updated = false;

    // Deep traverse and fix
    async function traverseAndFix(obj) {
      if (!obj) return;
      if (typeof obj === "string") {
        if (obj.includes("/api/media/")) {
          const id = obj.split("/api/media/")[1];
          if (id) {
            const mediaSnap = await getDoc(doc(db, "media", id));
            if (mediaSnap.exists()) {
              const mediaData = mediaSnap.data();
              if (mediaData.url && mediaData.url.startsWith("data:image")) {
                console.log("Fixing image in page", pageDoc.id);
                
                try {
                  const storageRef = ref(storage, `media/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`);
                  await uploadString(storageRef, mediaData.url, 'data_url');
                  const publicUrl = await getDownloadURL(storageRef);
                  // Update media doc to have public URL so future queries are fast
                  await updateDoc(doc(db, "media", id), { url: publicUrl });
                  obj = publicUrl;
                } catch(e) {
                   console.log("Storage upload failed, keeping base64");
                   obj = mediaData.url;
                }
              } else if (mediaData.url && mediaData.url.startsWith("http")) {
                 obj = mediaData.url;
              }
              updated = true;
            }
          }
        }
        return obj;
      }
      if (Array.isArray(obj)) {
        for (let i=0; i<obj.length; i++) {
          obj[i] = await traverseAndFix(obj[i]);
        }
        return obj;
      }
      if (typeof obj === "object") {
        for (const k of Object.keys(obj)) {
          obj[k] = await traverseAndFix(obj[k]);
        }
        return obj;
      }
      return obj;
    }
    
    data = await traverseAndFix(data);
    if (updated) {
      await updateDoc(doc(db, "pages", pageDoc.id), data);
      console.log("Updated page", pageDoc.id);
    }
  }
  
  // also check home page in case it's in settings
  const settingsSnap = await getDoc(doc(db, "settings", "general"));
  if (settingsSnap.exists()) {
    let data = settingsSnap.data();
    let updated = false;
    async function traverseAndFix(obj) {
      if (!obj) return;
      if (typeof obj === "string") {
        if (obj.includes("/api/media/")) {
          const id = obj.split("/api/media/")[1];
          if (id) {
            const mediaSnap = await getDoc(doc(db, "media", id));
            if (mediaSnap.exists()) {
              const mediaData = mediaSnap.data();
              if (mediaData.url && mediaData.url.startsWith("data:image")) {
                console.log("Fixing image in settings");
                try {
                  const storageRef = ref(storage, `media/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`);
                  await uploadString(storageRef, mediaData.url, 'data_url');
                  const publicUrl = await getDownloadURL(storageRef);
                  await updateDoc(doc(db, "media", id), { url: publicUrl });
                  obj = publicUrl;
                } catch(e) {
                   obj = mediaData.url;
                }
              } else if (mediaData.url && mediaData.url.startsWith("http")) {
                 obj = mediaData.url;
              }
              updated = true;
            }
          }
        }
        return obj;
      }
      if (Array.isArray(obj)) {
        for (let i=0; i<obj.length; i++) {
          obj[i] = await traverseAndFix(obj[i]);
        }
        return obj;
      }
      if (typeof obj === "object") {
        for (const k of Object.keys(obj)) {
          obj[k] = await traverseAndFix(obj[k]);
        }
        return obj;
      }
      return obj;
    }
    
    data = await traverseAndFix(data);
    if (updated) {
      await updateDoc(doc(db, "settings", "general"), data);
      console.log("Updated settings");
    }
  }
  console.log("Done");
  process.exit(0);
}
run();
