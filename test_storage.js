import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import fs from "fs";

const firebaseConfig = JSON.parse(fs.readFileSync("./firebase-applet-config.json", "utf8"));
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const storageRef = ref(storage, "test.txt");

async function run() {
  try {
    await uploadString(storageRef, "Hello World");
    const url = await getDownloadURL(storageRef);
    console.log("Success! URL:", url);
  } catch (e) {
    console.error("Storage failed:", e.message);
  }
  process.exit(0);
}
run();
