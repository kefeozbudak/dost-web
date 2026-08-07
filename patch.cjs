const fs = require('fs');
const file = 'src/admin/hubs/LgsCenter.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'format(new Date(report.createdAt), "dd.MM.yyyy HH:mm")',
  'format(report.createdAt?.toDate?.() || new Date(report.createdAt), "dd.MM.yyyy HH:mm")'
);

content = content.replace(
  'format(report.createdAt, "dd MMM HH:mm"',
  'format(report.createdAt?.toDate?.() || new Date(report.createdAt), "dd MMM HH:mm"'
);

fs.writeFileSync(file, content);
console.log('Patched LgsCenter.tsx');
