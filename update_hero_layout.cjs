const fs = require('fs');

let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Find the hero case
const heroCaseRegex = /case 'hero':\s*return \(\s*<section key=\{index\}.*?>\s*([\s\S]*?)\s*<\/section>\s*\);/;

const match = code.match(heroCaseRegex);
if (match) {
    console.log("Hero case found!");
    // We will extract the three parts and wrap them
} else {
    console.log("Hero case NOT found!");
}
