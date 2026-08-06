import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import fs from "fs";

// Find firebase config
let configStr = fs.readFileSync("src/lib/firebase.ts", "utf8");
let m = configStr.match(/const firebaseConfig = ({[\s\S]*?});/);
if (!m) {
  console.log("No config found");
  process.exit(1);
}
let config = eval("(" + m[1] + ")");

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
        console.log("Updated homepage!");
      }
    }
  }
  process.exit(0);
}
run();
