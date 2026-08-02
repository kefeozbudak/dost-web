import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const app = initializeApp({ projectId: 'ai-studio-90f1ddb0-eaa1-43e2-bc32-18fb73bc7175' });
const db = getFirestore(app);

async function test() {
  const homeDoc = await getDoc(doc(db, 'pages', 'home'));
  console.log(JSON.stringify(homeDoc.data(), null, 2));
  process.exit(0);
}

test().catch(console.error);
