import { db } from "./src/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

async function run() {
  const pages = await getDocs(collection(db, 'pages'));
  pages.forEach(p => {
    console.log(p.id, p.data().title);
  });
  process.exit(0);
}
run();
