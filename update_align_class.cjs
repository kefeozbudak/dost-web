const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Update getAlignClass definition
code = code.replace(
  'export const getAlignClass = (block: any, defaultClass: string = "mx-auto") => {',
  'export const getAlignClass = (block: any, fieldKey: string = "", defaultClass: string = "mx-auto") => {\n  const specificAlign = fieldKey ? block?.styles?.[`${fieldKey}Align`] : null;\n  const align = specificAlign || block?.styles?.textAlign;\n  if (align === "left") return "mr-auto ml-0";\n  if (align === "right") return "ml-auto mr-0";\n  if (align === "center") return "mx-auto";\n'
);

// We need to replace `getAlignClass(block)` with `getAlignClass(block, "title")` for h1, h2, etc.
// But it's easier to just do it generally for title, subtitle, desc where they are used.
// Or we can just remove `max-w-` from elements when they are left/right aligned?
// Actually, if we just make `getAlignClass` look at titleAlign/subtitleAlign if passed, we can write a script to inject the fieldKey.

// Instead of regex madness, let's just use `block?.styles?.textAlign || block?.styles?.titleAlign || block?.styles?.subtitleAlign || block?.styles?.descAlign`.
// If ANY of them are 'left', maybe just align left?
// No, that would align the title if the subtitle is left-aligned. That's bad.
