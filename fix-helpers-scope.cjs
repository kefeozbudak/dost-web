const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Find the injected code block
const helpersStart = code.indexOf('const getValidText = (...values: any[]) => {');
const helpersEnd = code.indexOf('};', code.indexOf('const getValidStyle = ')) + 2;

if (helpersStart !== -1 && helpersEnd !== -1) {
    const helpersCode = code.substring(helpersStart, helpersEnd);
    
    // Remove it from its current position
    code = code.substring(0, helpersStart) + code.substring(helpersEnd);
    
    // Insert it after getIndividualButtonStyle, but OUTSIDE of it
    // Wait, let's insert it before `const getIndividualButtonStyle`
    const insertPos = code.indexOf('const getIndividualButtonStyle = (btn: any) => {');
    
    if (insertPos !== -1) {
        code = code.substring(0, insertPos) + helpersCode + '\n' + code.substring(insertPos);
        fs.writeFileSync('src/components/PageBlocks.tsx', code);
        console.log("Helpers moved outside.");
    } else {
        console.log("Could not find insertPos");
    }
} else {
    console.log("Helpers not found");
}
