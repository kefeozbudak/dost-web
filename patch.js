const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');
const sanitize = `
    const sanitizeData = (obj: any): any => {
      if (typeof obj === 'string') {
        if (obj.startsWith('data:image/')) return '';
        return obj;
      }
      if (Array.isArray(obj)) return obj.map(sanitizeData);
      if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key of Object.keys(obj)) {
          if (obj[key] !== undefined) {
             newObj[key] = sanitizeData(obj[key]);
          }
        }
        return newObj;
      }
      return obj;
    };
`;
file = file.replace('const handleSave = async () => {', sanitize + '\n  const handleSave = async () => {');
file = file.replace('await setDoc(doc(db, \'settings\', \'header\'), headerData);', 'await setDoc(doc(db, \'settings\', \'header\'), sanitizeData(headerData));');
fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
