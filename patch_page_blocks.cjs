const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
    /const getItemDescStyle = \(block: any\) => getStyle\(block, "itemDesc"\);/,
    `const getItemDescStyle = (block: any) => getStyle(block, "itemDesc");
  const getItemButtonStyle = (block: any) => getStyle(block, "itemButton");`
);

content = content.replace(
    /className="w-full py-3\.5 px-4 rounded-xl bg-\[#5eead4\] text-\[#0f172a\] font-bold text-sm text-center hover:bg-\[#4fd1c5\] hover:shadow-lg hover:shadow-\[#5eead4\]\/20 transition-all duration-300"/,
    `className="w-full py-3.5 px-4 rounded-xl bg-[#5eead4] text-[#0f172a] font-bold text-sm text-center hover:opacity-90 hover:shadow-lg transition-all duration-300 block"
                          style={getItemButtonStyle(block)}`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched PageBlocks");
