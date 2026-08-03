const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const regex = /const ClubRegistrationFormBlock = \(\{(.*?)\}\) \=\> \{[\s\S]*?\}\;\n/m;
const match = code.match(/const ClubRegistrationFormBlock = \(\{[\s\S]*?\n\};\n/);
if (match) {
    console.log("Found match!");
} else {
    console.log("Could not find full block, let's use another method.");
}
