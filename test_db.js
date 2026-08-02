import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  projectId: "ai-studio-90f1ddb0-eaa1-43e2-bc32-18fb73bc7175",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const docRef = doc(db, 'pages', 'basarilarimiz');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Blocks in DB:");
    docSnap.data().blocks.forEach(b => console.log(b.type));
  } else {
    console.log("No document found in DB, using defaultData");
  }
  process.exit(0);
}
run();
