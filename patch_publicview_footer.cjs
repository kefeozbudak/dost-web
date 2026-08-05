const fs = require('fs');
let file = fs.readFileSync('./src/pages/PublicView.tsx', 'utf8');

file = file.replace("<Footer data={footerData} />", "<Footer data={footerData} headerData={headerData} />");

fs.writeFileSync('./src/pages/PublicView.tsx', file);
