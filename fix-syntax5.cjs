const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/PopupCenter.tsx', 'utf8');

const lines = code.split('\n');
lines[1498] = "                    })()}";
lines[1499] = "";
fs.writeFileSync('src/admin/hubs/PopupCenter.tsx', lines.join('\n'));
