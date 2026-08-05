const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/ReportCenter.tsx', 'utf8');

const targetStr = `                          {report.type === 'is_basvuru_formu' ? 'İş Başvurusu' : report.type === 'pre_registration_form' ? 'Ön Kayıt Formu' : report.type === 'contact_form' ? 'İletişim Formu' : ((report.type === 'chat' || !report.type) ? 'Veli Asistanı Formu' : (report.data?.formName || 'Veli Asistanı Formu'))}`;
const replacementStr = `                          {report.type === 'newsletter' ? 'E-Bülten Aboneliği' : report.type === 'is_basvuru_formu' ? 'İş Başvurusu' : report.type === 'pre_registration_form' ? 'Ön Kayıt Formu' : report.type === 'contact_form' ? 'İletişim Formu' : ((report.type === 'chat' || !report.type) ? 'Veli Asistanı Formu' : (report.data?.formName || 'Veli Asistanı Formu'))}`;

file = file.replace(targetStr, replacementStr);
fs.writeFileSync('./src/admin/hubs/ReportCenter.tsx', file);
