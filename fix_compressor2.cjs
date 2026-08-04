const fs = require('fs');
let code = fs.readFileSync('src/lib/imageCompressor.ts', 'utf8');

const replacement = `        try {
          const storageRef = ref(storage, \`media/\${Date.now()}_\${Math.random().toString(36).substring(7)}.jpg\`);
          await uploadString(storageRef, base64ToSave, 'data_url');
          const publicUrl = await getDownloadURL(storageRef);
          
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

// Replace everything between `img.src = obj; }); }` and `} catch (err) {`
code = code.replace(/const docRef = await addDoc\(collection\(db, "media"\), \{[\s\S]*?return `\/api\/media\/\$\{docRef.id\}`;/, replacement);

fs.writeFileSync('src/lib/imageCompressor.ts', code);
console.log('Fixed compressor using regex');
