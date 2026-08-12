const fs = require('fs');

let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const idx = content.indexOf("check_circle           case");
if (idx !== -1) {
    const badSnippet = content.substring(idx - 150, idx + 800);
    console.log("Found bad snippet, replacing...");
    
    // We want to replace from check_circle down to the end of the corrupted block
    // Let's just find the start of check_circle
    const startIdx = content.indexOf("check_circle", idx - 50);
    const endIdx = content.indexOf("Detaylı Bilgi", startIdx) + 100;
    
    // The exact text we are replacing is whatever is in there right now.
    // Instead of string replacement, we can just slice and insert.
    // But let's first see what's actually there.
} else {
    console.log("Not found.");
}
