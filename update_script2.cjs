const fs = require('fs');
let code = fs.readFileSync('src/components/MediaPickerModal.tsx', 'utf8');

code = code.replace(
  `import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, limit } from 'firebase/firestore';`,
  `import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc, limit } from 'firebase/firestore';\nimport { ref, uploadString, getDownloadURL } from 'firebase/storage';\nimport { storage } from '../lib/firebase';`
);

const target = `
          const base64 = await compressImageFile(file, 2000, 2000, 0.88);
          
          await addDoc(collection(db, 'media'), {
            name: file.name,
            url: base64,
            size: file.size,
            type: file.type,
            createdAt: serverTimestamp()
          });
`;

const replacement = `
          const base64 = await compressImageFile(file, 2000, 2000, 0.88);
          
          let publicUrl = base64;
          try {
            const storageRef = ref(storage, \`media/\${Date.now()}_\${Math.random().toString(36).substring(7)}_\${file.name}\`);
            await uploadString(storageRef, base64, 'data_url');
            publicUrl = await getDownloadURL(storageRef);
          } catch (storageErr) {
            console.error("Storage upload failed, falling back to Firestore base64:", storageErr);
          }

          await addDoc(collection(db, 'media'), {
            name: file.name,
            url: publicUrl,
            size: file.size,
            type: file.type,
            createdAt: serverTimestamp()
          });
`;

code = code.replace(target.trim(), replacement.trim());

const onClickTarget = "onClick={() => onSelect(item.id ? `/api/media/${item.id}` : item.url)}";
const onClickReplacement = "onClick={() => onSelect(item.url)}";
code = code.replace(onClickTarget, onClickReplacement);

fs.writeFileSync('src/components/MediaPickerModal.tsx', code);
