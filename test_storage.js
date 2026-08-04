import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

async function run() {
  try {
     const storageRef = ref(storage, 'test.txt');
     await uploadString(storageRef, 'hello world', 'raw');
     console.log("Upload success!");
  } catch(e) {
     console.error("Upload failed:", e);
  }
  process.exit(0);
}
run();
