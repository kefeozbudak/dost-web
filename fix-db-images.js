import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import config from './firebase-applet-config.json' with { type: 'json' };
import sharp from 'sharp';

const app = initializeApp(config);
const db = getFirestore(app);

async function processObject(obj) {
  if (typeof obj === 'string' && obj.startsWith('data:image/')) {
    try {
      const match = obj.match(/^data:image\/(\w+);base64,(.+)$/);
      if (match) {
        const ext = match[1];
        const base64Data = match[2];
        const buffer = Buffer.from(base64Data, 'base64');
        const resizedBuffer = await sharp(buffer)
          .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 40 })
          .toBuffer();
        
        console.log(`Resized image from ${buffer.length} to ${resizedBuffer.length} bytes`);
        return `data:image/jpeg;base64,${resizedBuffer.toString('base64')}`;
      }
    } catch (e) {
      console.error('Error processing image:', e);
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = await processObject(obj[i]);
    }
  } else if (obj !== null && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      obj[key] = await processObject(obj[key]);
    }
  }
  return obj;
}

async function fixHome() {
  console.log('Fetching pages/home...');
  const docRef = doc(db, 'pages', 'home');
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    let data = snap.data();
    console.log('Original size approx:', JSON.stringify(data).length);
    data = await processObject(data);
    console.log('New size approx:', JSON.stringify(data).length);
    
    await setDoc(docRef, data);
    console.log('Successfully saved compressed home page!');
  } else {
    console.log('home document not found');
  }
  process.exit(0);
}

fixHome().catch(console.error);
