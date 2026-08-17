const fs = require('fs');
let content = fs.readFileSync('src/lib/styleUtils.ts', 'utf-8');

const overlayClassRegex = /export const getHeroOverlayClass = \(block: any, defaultClasses: string\) => \{[\s\S]*?\};/;

const newCode = `export const getHeroOverlayClass = (block: any, defaultClasses: string) => {
  const isEnabled = block.styles?.enableDarkOverlay;
  if (!isEnabled) return \`\${defaultClasses} opacity-0 pointer-events-none\`;
  
  const hoverReveal = block.styles?.overlayHoverReveal !== false; // true by default
  const hoverClass = hoverReveal ? "group-hover:opacity-0" : "";
  
  // We use inline styles for the actual color and opacity, so we just return the layout classes + hover transition
  // We strip bg- gradient classes from default so our solid color takes full effect without weird blending
  const baseClasses = defaultClasses.split(' ').filter(c => !c.startsWith('bg-') && !c.startsWith('from-') && !c.startsWith('via-') && !c.startsWith('to-')).join(' ');
  
  return \`\${baseClasses} \${hoverClass} transition-opacity duration-500 pointer-events-none\`;
};

export const getHeroOverlayStyle = (block: any): React.CSSProperties => {
  const isEnabled = block.styles?.enableDarkOverlay;
  if (!isEnabled) return {};

  const color = block.styles?.overlayColor || "#000000";
  const opacity = block.styles?.overlayOpacity ?? 100;
  
  // Convert hex to rgb
  let r = 0, g = 0, b = 0;
  if (color.length === 7) {
    r = parseInt(color.slice(1, 3), 16);
    g = parseInt(color.slice(3, 5), 16);
    b = parseInt(color.slice(5, 7), 16);
  } else if (color.length === 4) {
    r = parseInt(color.slice(1, 2).repeat(2), 16);
    g = parseInt(color.slice(2, 3).repeat(2), 16);
    b = parseInt(color.slice(3, 4).repeat(2), 16);
  }
  
  return {
    backgroundColor: \`rgba(\${r}, \${g}, \${b}, \${opacity / 100})\`,
    // If they want blend mode in future: mixBlendMode: block.styles?.overlayBlendMode || "normal"
  };
};`;

content = content.replace(overlayClassRegex, newCode);
fs.writeFileSync('src/lib/styleUtils.ts', content);
console.log("Patched styleUtils.ts");
