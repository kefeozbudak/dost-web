import fs from 'fs';

let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

function updateHero(heroType) {
  const casePattern = new RegExp(`(\\{block\\.type === "${heroType}" && \\(\\s*<div className="space-y-4">\\s*\\{renderCommonFields\\(\\)\\})`);
  
  const replacement = `$1
            {renderTextareaWithStyle("Başlık Bölüm 1", "titlePart1")}
            {renderTextareaWithStyle("Başlık Bölüm 2 (Renkli)", "titlePart2")}
            {renderInputWithStyle("Başlık Bölüm 2 Rengi", "titlePart2Color")}`;

  if (content.match(casePattern)) {
     content = content.replace(casePattern, replacement);
     console.log(`Updated editor for ${heroType}`);
  } else {
     console.log(`Pattern not found for ${heroType}`);
  }
}

updateHero("kindergarten_hero");
updateHero("primary_school_hero");
updateHero("middle_school_hero");

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
