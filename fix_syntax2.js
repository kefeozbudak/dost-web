import fs from 'fs';
let pb = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const bentoStart = pb.indexOf('case "bento_academic":');
let nextBlock = pb.indexOf('case "', bentoStart + 25);
let nextIf = pb.indexOf('if (block.type ===', bentoStart + 25);

let endIdx = nextBlock;
if (nextIf !== -1 && (nextIf < nextBlock || nextBlock === -1)) {
    endIdx = nextIf;
}

if (bentoStart !== -1 && endIdx !== -1) {
    pb = pb.substring(0, bentoStart) + pb.substring(endIdx);
    fs.writeFileSync('src/components/PageBlocks.tsx', pb);
    console.log("Removed corrupted bento_academic and partial high_school_programs.");
} else {
    console.log("Could not find bounds.", bentoStart, nextBlock, nextIf);
}
