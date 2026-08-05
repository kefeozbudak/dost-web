const fs = require('fs');
let file = fs.readFileSync('./src/components/Header.tsx', 'utf8');

file = file.replace(/className="self-start \$\{data\?\.menuTypography\?\.subMenuFontSize \|\| 'text-sm'\} \$\{data\?\.menuTypography\?\.subMenuFontWeight \|\| 'font-bold'\} bg-primary px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors"/, "className={`self-start ${data?.menuTypography?.subMenuFontSize || 'text-sm'} ${data?.menuTypography?.subMenuFontWeight || 'font-bold'} bg-primary px-4 py-2 rounded-lg hover:bg-white hover:text-primary transition-colors`}");

file = file.replace(/className="\$\{data\?\.menuTypography\?\.subMenuFontSize \|\| 'text-sm'\} \$\{data\?\.menuTypography\?\.subMenuFontWeight \|\| 'font-bold'\} text-primary mb-1"/, "className={`${data?.menuTypography?.subMenuFontSize || 'text-sm'} ${data?.menuTypography?.subMenuFontWeight || 'font-bold'} text-primary mb-1`}");

fs.writeFileSync('./src/components/Header.tsx', file);
