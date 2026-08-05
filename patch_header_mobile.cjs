const fs = require('fs');
let file = fs.readFileSync('./src/components/Header.tsx', 'utf8');

file = file.replace(/className=\{`font-bold flex-1 flex items-center gap-2 \$\{isLinkActive\(link\.url\) \? 'nav-link-active' : 'nav-link-normal custom-hover-color'\}`\}/, "className={`flex-1 flex items-center gap-2 ${data?.menuTypography?.topMenuFontSize || 'text-base'} ${data?.menuTypography?.topMenuFontWeight || 'font-bold'} ${isLinkActive(link.url) ? 'nav-link-active' : 'nav-link-normal custom-hover-color'}`}");

fs.writeFileSync('./src/components/Header.tsx', file);
