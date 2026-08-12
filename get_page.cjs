const admin = require('firebase-admin');
const serviceAccount = require('./firebase-applet-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function main() {
  const snapshot = await db.collection('pages').get();
  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.title && data.title.includes('Yönetim')) {
       console.log('Page ID:', doc.id);
       console.log(JSON.stringify(data, null, 2));
    }
  });
}

main().catch(console.error);
