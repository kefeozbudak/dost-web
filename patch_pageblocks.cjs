const fs = require('fs');
const file = 'src/components/PageBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

const anchor = `className="w-full px-4 md:px-0 mb-16 whitespace-pre-line"`;
const replacement = `className="max-w-[1280px] mx-auto px-4 md:px-8 mb-16 whitespace-pre-line"`;

if (content.includes(anchor)) {
    content = content.replace(anchor, replacement);
    fs.writeFileSync(file, content);
    console.log("Patched PageBlocks.tsx (w-full to max-w)");
} else {
    console.log("Could not find anchor in PageBlocks.tsx");
}
