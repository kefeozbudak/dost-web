const fs = require('fs');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find all components ending with HeroBlock
  const parts = content.split(/const [A-Za-z0-9]+HeroBlock =/);
  
  for (let i = 1; i < parts.length; i++) {
    let blockContent = parts[i];
    
    // Find the first top-level element and add 'group' to its className
    blockContent = blockContent.replace(/className="([^"]*relative[^"]*)"/, (match, p1) => {
      if (!p1.includes('group')) {
        return `className="group ${p1}"`;
      }
      return match;
    });
    
    // Find the overlay div. It usually starts with <div className="absolute inset-0 bg-
    // We should replace it with <div className={getHeroOverlayClass(block, "...")}></div>
    blockContent = blockContent.replace(/<div className="(absolute inset-0 bg-[^"]+)"[^>]*><\/div>/, (match, p1) => {
      return `<div className={getHeroOverlayClass(block, "${p1}")}></div>`;
    });
    
    // Sometimes it's not closed on the same line, or has style prop.
    // E.g. <div className="absolute inset-0 bg-..." />
    blockContent = blockContent.replace(/<div className="(absolute inset-0 bg-[^"]+)" \/>/, (match, p1) => {
      return `<div className={getHeroOverlayClass(block, "${p1}")} />`;
    });
    
    parts[i] = blockContent;
  }
  
  let newContent = parts[0];
  for (let i = 1; i < parts.length; i++) {
    // We need to restore the "const XHeroBlock =" part. We lost it in split.
    // Wait, split removes the separator. So we can't just join.
    // Let's use a regex with match and replace instead.
  }
}
