const fs = require('fs');

const processFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace <section className="relative to <section className="group relative
  // Wait, there could be <header className="relative or <div className="relative
  // Let's just find the Hero block definitions.
  const blockRegex = /const ([a-zA-Z0-9]+HeroBlock) = \(\{[\s\S]*?return \([\s\S]*?<([a-z]+)[^>]*className="([^"]*)"/g;
  
  let newContent = content;
  
  let match;
  while ((match = blockRegex.exec(content)) !== null) {
    const blockName = match[1];
    const tag = match[2];
    const classStr = match[3];
    
    // add 'group ' if not present
    if (!classStr.includes('group ') && !classStr.includes('group')) {
      const newClassStr = 'group ' + classStr;
      // replace the exact string in the file, but we need to be careful
      newContent = newContent.replace(`className="${classStr}"`, `className="${newClassStr}"`);
    }
  }
  
  // Now find the overlay divs.
  // absolute inset-0 bg-gradient... or absolute inset-0 bg-...
  // We need to only target those that act as overlays for heroes.
  // A simple way is to replace all `<div className="absolute inset-0 bg-` with `<div className={getHeroOverlayClass(block, "absolute inset-0 bg-` and `")}></div>` instead of `"></div>`.
  // BUT we must only do this inside Hero blocks.
  
  fs.writeFileSync(filePath, newContent);
};

// I will do manual replacements for each file using a script.
