const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// First replace className="... max-w-container-max ..." 
content = content.replace(/className="([^"]*)max-w-container-max([^"]*)"/g, 'className={`$1${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"}$2`}');

// Also handle max-w-7xl
content = content.replace(/className="([^"]*)max-w-7xl([^"]*)"/g, 'className={`$1${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl"}$2`}');

// Also handle max-w-6xl
content = content.replace(/className="([^"]*)max-w-6xl([^"]*)"/g, 'className={`$1${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-6xl"}$2`}');

// For the existing template literals, we need to match only if they don't already contain block.styles?.fullWidth
content = content.replace(/className=\{`([^`]*)max-w-container-max([^`]*)`\}/g, (match, p1, p2) => {
    if (match.includes('block.styles?.fullWidth')) return match;
    return `className={\`${p1}\${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"}${p2}\`}`;
});

content = content.replace(/className=\{`([^`]*)max-w-7xl([^`]*)`\}/g, (match, p1, p2) => {
    if (match.includes('block.styles?.fullWidth')) return match;
    return `className={\`${p1}\${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl"}${p2}\`}`;
});

content = content.replace(/className=\{`([^`]*)max-w-6xl([^`]*)`\}/g, (match, p1, p2) => {
    if (match.includes('block.styles?.fullWidth')) return match;
    return `className={\`${p1}\${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-6xl"}${p2}\`}`;
});

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Done fixing fullWidth");
