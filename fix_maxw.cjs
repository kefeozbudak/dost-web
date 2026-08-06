const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// replace max-w-container-max
content = content.replace(/max-w-container-max/g, '${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"}');

// replace max-w-7xl
content = content.replace(/max-w-7xl/g, '${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl"}');

// But wait, there are places where it's inside quotes like "max-w-container-max mx-auto px-gutter"
// If I just replace "max-w-container-max", it becomes "max-w-full px-0" which works.
// However, if the string is currently "className='... max-w-container-max ...'", doing a blind replace will make it "className='... ${...} ...'" which is just a string, not a template literal!
