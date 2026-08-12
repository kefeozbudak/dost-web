const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to find `className={`...` and then whatever is next, until the NEXT character before `>` that is a backtick, and add a `}`
    // Actually, let's just find `className={` followed by anything up to a backtick, and make sure it ends with `}`.
    // If it ends with just a backtick and then a space or `>`, we replace the backtick with `\`} ` or `\`} >`.
    
    // Regex: /(className={`[^`]+)`(?=[\s>])/g
    content = content.replace(/(className={`[^`]+)`(?=[\s>])/g, '$1`}');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

fixFile('src/components/AboutBlocks.tsx');
fixFile('src/components/SchoolBlocks.tsx');
