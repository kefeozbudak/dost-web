const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, updateDoc } = require("firebase/firestore");
const fs = require("fs");

let config = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf8"));

const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function run() {
  const q = collection(db, "pages");
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    if (data.slug === "" || data.slug === "/") { // Homepage
      const blocks = data.blocks;
      for (let block of blocks) {
        if (block.type.includes('hero')) {
          console.log("Title found:", block.title);
        }
      }
    }
  }
  process.exit(0);
}
run();
