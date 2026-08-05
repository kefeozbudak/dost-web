const fs = require('fs');
let file = fs.readFileSync('./src/index.css', 'utf8');

file = file.replace(/family=Montserrat:ital,wght@0,100\.\.900;1,100\.\.900/g, 'family=Inter:wght@300;400;500;600;700;800;900');
file = file.replace(/'Montserrat'/g, "'Inter'");

fs.writeFileSync('./src/index.css', file);
