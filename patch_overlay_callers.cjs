const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/components/*Blocks.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  
  if (content.includes('getHeroOverlayClass') && !content.includes('getHeroOverlayStyle')) {
    content = content.replace('getHeroOverlayClass,', 'getHeroOverlayClass, getHeroOverlayStyle,');
  }

  const regex = /className=\{getHeroOverlayClass\(([^)]+)\)\}/g;
  
  content = content.replace(regex, (match, p1) => {
    return "className={getHeroOverlayClass(" + p1 + ")} style={getHeroOverlayStyle(block)}";
  });
  
  fs.writeFileSync(file, content);
  console.log("Patched", file);
});
