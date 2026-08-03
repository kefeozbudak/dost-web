const fs = require('fs');
const content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const regex = /renderArrayEditor\(\s*['"]\w+['"]\s*,\s*\[(.*?)\]/gs;
let match;
let matchCount = 0;
while ((match = regex.exec(content)) !== null) {
    const fieldsStr = match[1];
    const keyRegex = /key:\s*['"]([^'"]+)['"]/g;
    let keyMatch;
    const keys = [];
    while ((keyMatch = keyRegex.exec(fieldsStr)) !== null) {
        const key = keyMatch[1];
        if (keys.includes(key)) {
            console.log("Found duplicate key:", key, "in", match[0].substring(0, 100));
        }
        keys.push(key);
    }
}
console.log("Done checking");
