const fs = require('fs');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace max-w-[1280px] px-8 with full width support
    content = content.replace(/className="max-w-\[1280px\] mx-auto px-8/g, 'className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto');
    content = content.replace(/className="max-w-\[1280px\] mx-auto px-6/g, 'className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-6"} mx-auto');
    content = content.replace(/className="max-w-7xl mx-auto px-8/g, 'className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl px-8"} mx-auto');
    content = content.replace(/className="max-w-7xl mx-auto px-6/g, 'className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-7xl px-6"} mx-auto');
    
    // Replace hardcoded text-center with textAlign support, but only inside block components where `block` is available
    // A safer way is to do it manually or via a careful regex. Let's just fix fullWidth first.

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Processed ${filePath}`);
}

processFile('src/components/AboutBlocks.tsx');
processFile('src/components/SchoolBlocks.tsx');
