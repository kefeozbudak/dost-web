import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

const app = initializeApp({
  projectId: "upheld-welder-321314",
  appId: "1:658565745414:web:a8e2712f9a58383252ac87",
  apiKey: "AIzaSyBx9-2F6PCefhJknbzh5T2oSRWwgdvzZP0",
});

const db = getFirestore(app);

async function check() {
  const docRef = doc(db, 'pages', 'kayit-fiyatlari');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    console.log("EXISTS!", Object.keys(snap.data()));
    console.log("isDeleted:", snap.data().isDeleted);
  } else {
    console.log("DOES NOT EXIST");
  }
}
check();
