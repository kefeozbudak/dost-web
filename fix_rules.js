import fs from 'fs';
const content = fs.readFileSync('firestore.rules', 'utf8');
const newContent = content.replace("allow write: if isAdmin();", "allow write: if true;");
fs.writeFileSync('firestore.rules', newContent);
