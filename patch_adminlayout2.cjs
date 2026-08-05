const fs = require('fs');
let file = fs.readFileSync('./src/admin/AdminLayout.tsx', 'utf8');

file = file.replace(/if \(!careerSnap\.exists\(\) \|\| !careerSnap\.data\(\)\?\.blocks\) \{/, "if (!careerSnap.exists() || !careerSnap.data()?.blocks || careerSnap.data().blocks.length === 0) {");

fs.writeFileSync('./src/admin/AdminLayout.tsx', file);
