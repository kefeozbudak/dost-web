const fs = require('fs');
let file = fs.readFileSync('./src/admin/AdminLayout.tsx', 'utf8');

const targetStr = `const otherPages = pagesList.filter(p => !eduIds.includes(p.id) && !formIds.includes(p.id) && !campusIds.includes(p.id));`;

const newCode = `const otherPages = pagesList
    .filter(p => !eduIds.includes(p.id) && !formIds.includes(p.id) && !campusIds.includes(p.id))
    .sort((a, b) => (a.title || '').localeCompare(b.title || ''));`;

file = file.replace(targetStr, newCode);
fs.writeFileSync('./src/admin/AdminLayout.tsx', file);
