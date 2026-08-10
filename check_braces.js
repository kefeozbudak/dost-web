import fs from 'fs';
let pb = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

let depth = 0;
for (let i=0; i<pb.length; i++) {
    if (pb[i] === '{') depth++;
    if (pb[i] === '}') depth--;
}
console.log("Final depth:", depth);
