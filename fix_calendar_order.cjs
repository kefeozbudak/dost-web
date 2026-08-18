const fs = require('fs');
let code = fs.readFileSync('src/admin/CalendarGridEditor.tsx', 'utf8');

const useeffectMatch = /React\.useEffect\(\(\) => \{[\s\S]*?\}, \[activeArrayItem, arrayKey, currentArray\]\);/;
const useeffect = code.match(useeffectMatch)[0];
code = code.replace(useeffectMatch, '');

const arrayMatch = /const currentArray = block\[arrayKey\] \|\| \[\];/;
code = code.replace(arrayMatch, `const currentArray = block[arrayKey] || [];\n  ${useeffect}`);

fs.writeFileSync('src/admin/CalendarGridEditor.tsx', code);
