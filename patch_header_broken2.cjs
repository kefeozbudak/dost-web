const fs = require('fs');
let file = fs.readFileSync('./src/components/Header.tsx', 'utf8');

file = file.replace(/className="hidden sm:flex items-center bg-primary text-white \$\{data\?\.menuTypography\?\.topMenuFontSize \|\| 'text-sm'\} \$\{data\?\.menuTypography\?\.topMenuFontWeight \|\| 'font-bold'\} px-6 py-3 rounded-lg custom-hover-bg\/90 hover:shadow-lg active:scale-95 transition-all"/, "className={`hidden sm:flex items-center bg-primary text-white ${data?.menuTypography?.topMenuFontSize || 'text-sm'} ${data?.menuTypography?.topMenuFontWeight || 'font-bold'} px-6 py-3 rounded-lg custom-hover-bg/90 hover:shadow-lg active:scale-95 transition-all`}");

fs.writeFileSync('./src/components/Header.tsx', file);
