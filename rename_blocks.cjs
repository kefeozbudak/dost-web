const fs = require('fs');

let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  'if (block.type === "achievements_social_gallery") {',
  'if (block.type === "achievements_grid" || block.type === "achievements_social_gallery") {'
);

// We need to be careful with {item.desc}, let's target the exact string in achievements_grid
content = content.replace(
  /\{\s*item\.desc\s*\}/g,
  '{item.subtitle || item.desc}'
);

content = content.replace(
  'if (block.type === "achievements_science_projects") {',
  'if (block.type === "achievements_science" || block.type === "achievements_science_projects") {'
);

content = content.replace(
  /\{\s*block\.imageBadge\s*\}/g,
  '{block.highlightTag || block.imageBadge}'
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Renamed block types in PageBlocks.tsx");
