const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = initializeApp();
const db = getFirestore();

async function main() {
  const querySnapshot = await db.collection('pages').get();
  querySnapshot.forEach(doc => {
    const data = doc.data();
    if (data.blocks) {
      data.blocks.forEach(block => {
        if (block.type === 'hero' && block.buttons) {
          block.buttons.forEach(btn => {
             console.log("Page: ", data.title, "Hero Button: ", btn.text, " URL: ", btn.url);
          });
        }
      });
    }
  });
}

main().catch(console.error);
