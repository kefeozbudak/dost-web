const fs = require('fs');
let file = fs.readFileSync('./src/components/Header.tsx', 'utf8');

// Replace top menu typography
file = file.replace(/font-label-md text-label-md/g, "${data?.menuTypography?.topMenuFontSize || 'text-sm'} ${data?.menuTypography?.topMenuFontWeight || 'font-bold'}");
file = file.replace(/text-sm font-bold/g, "${data?.menuTypography?.subMenuFontSize || 'text-sm'} ${data?.menuTypography?.subMenuFontWeight || 'font-bold'}");

fs.writeFileSync('./src/components/Header.tsx', file);
