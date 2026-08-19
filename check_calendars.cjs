const fs = require('fs');
const code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const academicIndex = code.indexOf('case "academic_calendar":');
const menuIndex = code.indexOf('case "menu_calendar":');
const menuHeroIndex = code.indexOf('case "menu_hero":');

console.log('academic_calendar index:', academicIndex);
console.log('menu_calendar index:', menuIndex);
console.log('menu_hero index:', menuHeroIndex);
