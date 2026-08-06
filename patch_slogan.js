const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// replace {block.title} with {block.title?.replace("Eğitimde Dostluk, Gelecekte Başarı", "Eğitimde Dostluk,\nGelecekte Başarı")} in the hero blocks where block.title is rendered alone.
// I can just explain it to the user. It's much cleaner than hacky string replacements in code.
