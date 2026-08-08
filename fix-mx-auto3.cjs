const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// We will find all instances of max-w-2xl mx-auto, max-w-3xl mx-auto, max-w-4xl mx-auto, max-w-xl mx-auto
// and replace them with max-w-... ${getAlignClass(block)}
// BUT we have to convert the string to a template literal if it's not one.

code = code.replace(/className="([^"]*)max-w-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\s+mx-auto([^"]*)"/g, (match, before, size, after) => {
    return 'className={`' + before + 'max-w-' + size + ' ${getAlignClass(block)}' + after + '`}'
});

// For template literals that already exist, like \` ... max-w-3xl mx-auto ... \`
code = code.replace(/max-w-(xs|sm|md|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\s+mx-auto/g, 'max-w-$1 ${getAlignClass(block)}');

fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("Fixed all mx-autos in PageBlocks");
