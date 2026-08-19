import fs from 'fs';
const code = fs.readFileSync('dist/assets/index.js', 'utf8'); // or whatever the bundle is
console.log(code.includes('readAsDataURL(file)'));
