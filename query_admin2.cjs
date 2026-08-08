const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
admin.initializeApp({
  projectId: "ai-studio-remixdostkolejiw-c712b77d-c372-476c-9abe-c73cc1a75a3a"
});
const db = getFirestore();
async function run() {
  const querySnapshot = await db.collection("pages").get();
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
