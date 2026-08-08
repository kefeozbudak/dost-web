const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  "projectId": "upheld-welder-321314",
  "appId": "1:658565745414:web:a8e2712f9a58383252ac87",
  "apiKey": "AIzaSyBx9-2F6PCefhJknbzh5T2oSRWwgdvzZP0",
  "authDomain": "upheld-welder-321314.firebaseapp.com",
  "firestoreDatabaseId": "ai-studio-remixdostkolejiw-c712b77d-c372-476c-9abe-c73cc1a75a3a",
  "storageBucket": "upheld-welder-321314.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const querySnapshot = await getDocs(collection(db, "pages"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.blocks) {
      data.blocks.forEach(block => {
        if (block.title === "Kurucumuzdan Mesaj" || block.type === "quote_image") {
          console.log("Found in page:", data.title, "(ID: " + doc.id + ")");
          console.log(JSON.stringify(block, null, 2));
        }
      });
    }
  });
}
run();
