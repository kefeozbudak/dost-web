const admin = require('firebase-admin');

// Read config
const fs = require('fs');
let config;
if (fs.existsSync('firebase-applet-config.json')) {
    config = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
} else {
    console.error("Config not found");
    process.exit(1);
}

// Initialize admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: config.projectId,
            clientEmail: config.clientEmail || process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: config.privateKey || (process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined),
        })
    });
}
const db = admin.firestore();

async function run() {
    const doc = await db.collection('pages').doc('lise').get();
    if (doc.exists) {
        const data = doc.data();
        const block = data.blocks.find(b => b.type === 'high_school_programs');
        if (block) {
            console.log(JSON.stringify(block, null, 2));
        } else {
            console.log("Block not found");
        }
    } else {
        console.log("Doc not found");
    }
}
run();
