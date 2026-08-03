const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');
code = code.replace(")}\\n\\n        {block.type === 'club_registration_form' && (", ")}\n\n        {block.type === 'club_registration_form' && (");
fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
