const fs = require('fs');
let file = fs.readFileSync('./src/admin/AdminLayout.tsx', 'utf8');

const targetStr = `setPagesList(fetched.filter((p: any) => !p.isDeleted));`;
const newCode = `let filtered = fetched.filter((p: any) => !p.isDeleted);
        if (!filtered.find(p => p.id === 'egitim-sistemimiz')) {
          filtered.push({ id: 'egitim-sistemimiz', title: 'Eğitim Sistemimiz', path: '/egitim-sistemimiz' });
        }
        setPagesList(filtered);`;

file = file.replace(targetStr, newCode);
fs.writeFileSync('./src/admin/AdminLayout.tsx', file);
