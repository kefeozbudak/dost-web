const fs = require('fs');
let code = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const listStr = `{ type: 'pre_registration_form', label: 'Ön Kayıt Formu' },`;

if (code.indexOf("type: 'club_registration_form'") === -1) {
    code = code.replace(listStr, listStr + `\n                          { type: 'club_registration_form', label: 'Kulüp Kayıt Formu' },`);
    fs.writeFileSync('src/admin/PageEditor.tsx', code);
    console.log('Added to PageEditor');
} else {
    console.log('Already exists');
}
