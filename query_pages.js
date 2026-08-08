const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

const firebaseConfig = {
  projectId: "ai-studio-remixdostkolejiw-c712b77d-c372-476c-9abe-c73cc1a75a3a",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const querySnapshot = await getDocs(collection(db, "pages"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.blocks) {
      data.blocks.forEach(block => {
        if (block.type === "quote_image") {
          console.log("Found quote_image in page:", data.title);
          console.log(JSON.stringify(block, null, 2));
        }
      });
    }
  });
}
run();
