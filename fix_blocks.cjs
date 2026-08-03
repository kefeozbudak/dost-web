const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Replace education_levels map
content = content.replace(
    /<div\s+key=\{i\}\s+className="p-6 md:p-8 rounded-\[2rem\]/g,
    '<div key={i} data-editor-item-index={i} className="p-6 md:p-8 rounded-[2rem]'
);

// Replace campuses map
content = content.replace(
    /<div\s+key=\{i\}\s+className="bg-white rounded-3xl/g,
    '<div key={i} data-editor-item-index={i} className="bg-white rounded-3xl'
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Fixed blocks");
