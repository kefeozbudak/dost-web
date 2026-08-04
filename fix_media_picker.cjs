const fs = require('fs');
let code = fs.readFileSync('src/components/MediaPickerModal.tsx', 'utf8');

const target = `const selectedUrl = (item.url && item.url.startsWith('data:image/')) 
                      ? \`/api/media/\${item.id}\` 
                      : item.url;
                    onSelect(selectedUrl);`;

const replacement = `const selectedUrl = item.url;
                    onSelect(selectedUrl);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/MediaPickerModal.tsx', code);
console.log("Fixed MediaPickerModal.tsx");
