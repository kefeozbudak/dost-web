import admin from 'firebase-admin';

// Initialize the app without credentials (works in GCF/Cloud Run)
admin.initializeApp({
  projectId: "ai-studio-remixdostkolejiw-c712b77d-c372-476c-9abe-c73cc1a75a3a"
});

const db = admin.firestore();

async function run() {
  const querySnapshot = await db.collection("pages").get();
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.blocks) {
      data.blocks.forEach(block => {
        if (block.type === "quote_image") {
          console.log("Found quote_image in page:", data.title, "(ID: " + doc.id + ")");
          console.log(JSON.stringify(block, null, 2));
        }
      });
    }
  });
}
run();
