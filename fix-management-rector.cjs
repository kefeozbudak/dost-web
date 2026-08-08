const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const startIndex = code.indexOf('case "management_rector":');
const endIndex = code.indexOf('case "management_vice_rectors":', startIndex);
let blockCode = code.substring(startIndex, endIndex);

// Add style to title, name, role, quote in management_rector
blockCode = blockCode.replace(
  /<h3 className="text-3xl font-bold text-slate-900 dark:text-white whitespace-pre-line w-full md:w-auto">/g,
  '<h3 style={getStyle(block, "name")} className="text-3xl font-bold text-slate-900 dark:text-white whitespace-pre-line w-full md:w-auto">'
);

blockCode = blockCode.replace(
  /<p className="text-\[\#bd0f2c\] font-bold text-lg whitespace-pre-line">/g,
  '<p style={getStyle(block, "role")} className="text-[#bd0f2c] font-bold text-lg whitespace-pre-line">'
);

blockCode = blockCode.replace(
  /<p\n                        className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed relative z-10 whitespace-pre-line"/g,
  '<p\n                        style={{...getStyle(block, "quote"), whiteSpace: "pre-line"}}\n                        className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed relative z-10 whitespace-pre-line"'
);

code = code.substring(0, startIndex) + blockCode + code.substring(endIndex);
fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("management_rector styles applied");
