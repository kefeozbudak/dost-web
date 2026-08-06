const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, updateDoc } = require("firebase/firestore");
const fs = require("fs");

let config = JSON.parse(fs.readFileSync("firebase-applet-config.json", "utf8"));

const app = initializeApp(config);
const db = getFirestore(app);

async function run() {
  const q = collection(db, "pages");
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    let modified = false;
    if (data.slug === "" || data.slug === "/") { // Homepage
      const blocks = data.blocks;
      for (let block of blocks) {
        if (block.title === "Eğitimde Dostluk, Gelecekte Başarı" || block.title === "Eğitimde Dostluk, Gelecekte Başarı.") {
          block.title = "Eğitimde Dostluk,\nGelecekte Başarı";
          modified = true;
        } else if (block.title && block.title.includes("Eğitimde Dostluk, Gelecekte Başarı")) {
           block.title = block.title.replace("Eğitimde Dostluk, Gelecekte Başarı", "Eğitimde Dostluk,\nGelecekte Başarı");
           modified = true;
        }
      }
      if (modified) {
        await updateDoc(doc(db, "pages", docSnap.id), { blocks });
        console.log("Updated homepage slogan!");
      }
    }
  }
  process.exit(0);
}
run();
