const fs = require('fs');
let code = fs.readFileSync('src/lib/imageCompressor.ts', 'utf8');

const target = `        const docRef = await addDoc(collection(db, "media"), {
          name: "Sayfa Görseli",
          url: base64ToSave,
          createdAt: serverTimestamp(),
        });
        console.log(\`Auto-extracted Base64 image to media/\${docRef.id}\`);
        return \`/api/media/\${docRef.id}\`;`;

const replacement = `        try {
          // First upload to Firebase Storage to get a public URL
          const storageRef = ref(storage, \`media/\${Date.now()}_\${Math.random().toString(36).substring(7)}.jpg\`);
          await uploadString(storageRef, base64ToSave, 'data_url');
          const publicUrl = await getDownloadURL(storageRef);
          
          // Also save metadata to media collection for MediaPickerModal
          const docRef = await addDoc(collection(db, "media"), {
            name: "Sayfa Görseli",
            url: publicUrl,
            createdAt: serverTimestamp(),
          });
          
          console.log(\`Auto-extracted Base64 image to Storage and media/\${docRef.id}\`);
          return publicUrl;
        } catch (storageErr) {
          console.error("Storage upload failed, falling back to Firestore base64:", storageErr);
          const docRef = await addDoc(collection(db, "media"), {
            name: "Sayfa Görseli",
            url: base64ToSave,
            createdAt: serverTimestamp(),
          });
          return \`/api/media/\${docRef.id}\`;
        }`;

if (code.includes('Auto-extracted Base64 image')) {
   code = code.replace(target, replacement);
   fs.writeFileSync('src/lib/imageCompressor.ts', code);
   console.log('Fixed compressor');
} else {
   console.log('Target not found in compressor');
}
