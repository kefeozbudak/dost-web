const fs = require('fs');
let content = fs.readFileSync('src/lib/styleUtils.ts', 'utf-8');

const overlayCodeRegex = /export const getHeroOverlayClass = \(block: any, defaultClasses: string\) => \{[\s\S]*?\};/;

const newOverlayCode = `export const getHeroOverlayClass = (block: any, defaultClasses: string) => {
  const isEnabled = block.styles?.enableDarkOverlay;
  if (!isEnabled) return \`\${defaultClasses} opacity-0 pointer-events-none\`;
  
  const opacityMap: Record<number, string> = {
    0: "opacity-0",
    10: "opacity-10",
    20: "opacity-20",
    30: "opacity-30",
    40: "opacity-40",
    50: "opacity-50",
    60: "opacity-60",
    70: "opacity-70",
    80: "opacity-80",
    90: "opacity-90",
    100: "opacity-100"
  };
  
  const opacityValue = block.styles?.overlayOpacity ?? 100;
  const opacityClass = opacityMap[opacityValue as number] || "opacity-100";
  
  return \`\${defaultClasses} \${opacityClass} group-hover:opacity-0 transition-opacity duration-500 pointer-events-none\`;
};`;

if (content.match(overlayCodeRegex)) {
  content = content.replace(overlayCodeRegex, newOverlayCode);
  fs.writeFileSync('src/lib/styleUtils.ts', content);
  console.log("Patched styleUtils.ts");
} else {
  console.log("Could not find getHeroOverlayClass");
}
