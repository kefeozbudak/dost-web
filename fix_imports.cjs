const fs = require('fs');
const files = [
  'src/components/PageBlocks.tsx',
  'src/components/SchoolBlocks.tsx',
  'src/components/AboutBlocks.tsx',
  'src/components/ManagementBlocks.tsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  
  // Remove wrong imports from firebase/firestore
  content = content.replace(/getHeroOverlayClass,\s*collection/, 'collection');
  content = content.replace(/getHeroOverlayClass,\s*getStyle/, 'getStyle');
  
  // Find where styleUtils is imported and add it there
  content = content.replace(/import \{([^}]+)\} from "\.\.\/lib\/styleUtils";/g, (match, p1) => {
    if (!p1.includes('getHeroOverlayClass')) {
      return `import { getHeroOverlayClass, ${p1} } from "../lib/styleUtils";`;
    }
    return match;
  });
  
  fs.writeFileSync(file, content);
}
console.log("Imports fixed");
