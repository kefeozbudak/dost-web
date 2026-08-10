const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = initializeApp();
const db = getFirestore();

async function main() {
  const querySnapshot = await db.collection('pages').get();
  for (const doc of querySnapshot.docs) {
    const data = doc.data();
    let changed = false;
    if (data.blocks) {
      data.blocks = data.blocks.map(block => {
        if ((block.type === 'news_grid' || block.type === 'achievements_social_gallery' || block.type === 'achievements_grid') && block.items && block.items.length > 0) {
           console.log(`Reversing items in ${block.type} on page ${doc.id}`);
           block.items.reverse();
           changed = true;
        }
        return block;
      });
    }
    if (changed) {
      await doc.ref.update({ blocks: data.blocks });
      console.log(`Updated page ${doc.id}`);
    }
  }
}

main().catch(console.error);
