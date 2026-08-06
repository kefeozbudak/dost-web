import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const app = initializeApp({
  projectId: "ai-studio-remixdostkolejiw"
});
const db = getFirestore(app);

async function run() {
  const docRef = doc(db, "pages", "home");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(JSON.stringify(docSnap.data().blocks.filter(b => b.type === 'hero'), null, 2));
  } else {
    console.log("No such document!");
  }
}
run();
