const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Find all occurrences of hero blocks and inject getAlignClass where needed.
// This is best done by looking for getSubtitleStyle, getTitleStyle, getDescStyle
// and ensuring the corresponding tag has getAlignClass(block, "...")

// We can just inject ${getAlignClass(block, "...")} before whitespace-pre-line
// But we might duplicate it.

// Let's just review all getHeroInnerClass usages and make sure they also respect the alignments.
// In getHeroInnerClass:
code = code.replace(
  'const alignX = block.styles?.heroAlignX;',
  'const alignX = block.styles?.heroAlignX || block.styles?.textAlign;'
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log("Updated getHeroInnerClass");
