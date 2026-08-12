const fs = require('fs');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find lines like: className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto relative z-20 w-full">
    // where it starts with ` but ends with "
    
    // Actually just replace all `className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto` followed by anything ending in `"`
    // with `className={\`${...} mx-auto ...\`}
    
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (line.includes('className={`${block.styles?.fullWidth')) {
            // Check if it ends with "
            if (line.includes('">')) {
                // replace the ending "> with `>
                line = line.replace(/">$/, '`>');
                // replace the ending " with `
                line = line.replace(/"$/, '`');
            } else if (line.match(/"[^`]*$/)) { // If there's a double quote after the backtick block that wasn't closed by a backtick
                 // It's probably `className={`${...} mx-auto ..."` 
                 // Let's just fix it properly via regex.
            }
        }
        lines[i] = line;
    }

    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
}

