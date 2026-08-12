const fs = require('fs');

function fixFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // We want to find `className={`${block.styles?.fullWidth ? "max-w-full px-0" : "whatever"} mx-auto`
    // and then match everything until the NEXT double quote `"` that ends the attribute.
    // Like: `className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-[1280px] px-8"} mx-auto relative z-20 w-full">`
    // wait, the `">` has double quote. We want to replace the `"` with `\``
    
    content = content.replace(/(className={`\$\{block\.styles\?\.fullWidth \? "max-w-full px-0" : "[^"]+"\} mx-auto[^"]*)"/g, '$1`');
    
    fs.writeFileSync(filePath, content, 'utf8');
}

fixFile('src/components/AboutBlocks.tsx');
fixFile('src/components/SchoolBlocks.tsx');
