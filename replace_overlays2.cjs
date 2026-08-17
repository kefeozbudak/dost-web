const fs = require('fs');

function processFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  let insideHero = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.match(/const [A-Za-z0-9]+HeroBlock =/)) {
      insideHero = true;
    }
    
    if (insideHero && line.match(/^};\s*$/)) {
      insideHero = false;
    }
    
    if (insideHero) {
      // Add 'group' to the first wrapper if it has 'relative'
      if (line.match(/className="[^"]*relative[^"]*"/) && !line.includes('group') && !line.includes('getHeroInnerClass') && !line.includes('absolute')) {
        lines[i] = line.replace('className="', 'className="group ');
      }
      
      // Replace overlay div
      if (line.match(/<div className="absolute inset-0 bg-gradient-[^"]+"/)) {
        lines[i] = line.replace(/className="(absolute inset-0 bg-gradient-[^"]+)"/, 'className={getHeroOverlayClass(block, "$1")}');
      } else if (line.match(/<div className="absolute inset-0 bg-\[[^\]]+\][^"]+"/)) {
        lines[i] = line.replace(/className="(absolute inset-0 bg-\[[^\]]+\][^"]+)"/, 'className={getHeroOverlayClass(block, "$1")}');
      } else if (line.match(/<div className="absolute inset-0 bg-black\/[^"]+"/)) {
        lines[i] = line.replace(/className="(absolute inset-0 bg-black\/[^"]+)"/, 'className={getHeroOverlayClass(block, "$1")}');
      } else if (line.match(/<div className="absolute inset-0 bg-primary\/[^"]+"/)) {
        lines[i] = line.replace(/className="(absolute inset-0 bg-primary\/[^"]+)"/, 'className={getHeroOverlayClass(block, "$1")}');
      }
    }
  }
  
  fs.writeFileSync(file, lines.join('\n'));
}

processFile('src/components/PageBlocks.tsx');
processFile('src/components/SchoolBlocks.tsx');
processFile('src/components/AboutBlocks.tsx');
processFile('src/components/ManagementBlocks.tsx');
console.log("Processed all files.");
