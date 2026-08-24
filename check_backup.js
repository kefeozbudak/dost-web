const fs = require('fs');
const data = JSON.parse(fs.readFileSync('firestore_backup.json', 'utf8'));
const forms = data.forms || {};
console.log("Forms in backup:", Object.keys(forms).length);
const types = {};
for (const key in forms) {
  const f = forms[key];
  const t = f.formType || f.type || 'unknown';
  types[t] = (types[t] || 0) + 1;
}
console.log("Types in backup:", types);
