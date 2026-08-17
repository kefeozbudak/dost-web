const fs = require('fs');
let content = fs.readFileSync('src/lib/styleUtils.ts', 'utf-8');

const target = `    const opacityValue = block.styles?.overlayOpacity ?? 100;
  const opacityClass = opacityMap[opacityValue as number] || "opacity-100";
  
  return \`\${defaultClasses} \${opacityClass} group-hover:opacity-0 transition-opacity duration-500 pointer-events-none\`;
};`;

content = content.replace(target, '');
fs.writeFileSync('src/lib/styleUtils.ts', content);
console.log("Fixed styleUtils.ts");
