const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/ClubCenter.tsx', 'utf8');
code = code.replace(
    /\{report\.type === 'pre_registration_form'.*?\}/,
    "{'Kulüp Kayıt Formu'}"
);
fs.writeFileSync('src/admin/hubs/ClubCenter.tsx', code);
