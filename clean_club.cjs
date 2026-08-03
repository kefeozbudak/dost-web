const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/ClubCenter.tsx', 'utf8');

// Replace formName logic in handlePrint
code = code.replace(/const formName = .*?;/g, "const formName = 'Kulüp Kayıt Formu';");

// Replace form type display in the list
code = code.replace(/{report\.type === 'pre_registration_form' \? 'Ön Kayıt Formu' : report\.type === 'contact_form' \? 'İletişim Formu' : \(\(report\.type === 'chat' \|\| !report\.type\) \? 'Veli Asistanı Formu' : \(report\.data\?\.formName \|\| 'Veli Asistanı Formu'\)\)}/g, "{'Kulüp Kayıt Formu'}");

fs.writeFileSync('src/admin/hubs/ClubCenter.tsx', code);
console.log('Cleaned ClubCenter.tsx');
