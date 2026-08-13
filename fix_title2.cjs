const fs = require('fs');

const file = 'src/components/SchoolBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

// For SchoolHeroBlock
content = content.replace(
  /\{block\.title2 && <span className="text-\[#1d4eca\] block mt-2" dangerouslySetInnerHTML=\{\{ __html: block\.title2 \}\} \/>\}/g,
  '{block.title2 && <span className="text-[#1d4eca] block mt-2" style={getStyle(block, "title2")} dangerouslySetInnerHTML={{ __html: block.title2 }} />}'
);

// For HighSchoolHeroBlock
content = content.replace(
  /<span className="bg-clip-text text-transparent bg-gradient-to-r from-\[#1d4eca\] to-\[#006a62\]" dangerouslySetInnerHTML=\{\{ __html: block\.title2 \}\}>\S*<\/span>/g,
  '<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1d4eca] to-[#006a62]" style={getStyle(block, "title2")} dangerouslySetInnerHTML={{ __html: block.title2 }}></span>'
);

fs.writeFileSync(file, content);
console.log("Patched title2 in SchoolBlocks");
