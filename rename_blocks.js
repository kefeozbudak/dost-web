const fs = require('fs');

let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

content = content.replace(
  'if (block.type === "achievements_social_gallery") {',
  'if (block.type === "achievements_grid" || block.type === "achievements_social_gallery") {'
);

content = content.replace(
  '{item.desc}',
  '{item.subtitle || item.desc}'
);

content = content.replace(
  'if (block.type === "achievements_science_projects") {',
  'if (block.type === "achievements_science" || block.type === "achievements_science_projects") {'
);

content = content.replace(
  'if (block.type === "achievements_academic_bento") {',
  'if (block.type === "achievements_academic_bento" || block.type === "bento_academic_alt") {'
);

content = content.replace(
  '{block.imageBadge}',
  '{block.highlightTag || block.imageBadge}'
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Renamed block types in PageBlocks.tsx");
