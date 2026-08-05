const fs = require('fs');
let file = fs.readFileSync('./src/components/Header.tsx', 'utf8');

file = file.replace(/\{!link\.iconData\?\.iconOnly && link\.label\}/g, "{!link.iconData?.iconOnly && <span>{link.label}</span>}");
file = file.replace(/\{clink\.label\}/g, "<span>{clink.label}</span>");
file = file.replace(/\{sublink\.label\}/g, "<span>{sublink.label}</span>");
file = file.replace(/\{ctaLabel\}/g, "<span>{ctaLabel}</span>");

fs.writeFileSync('./src/components/Header.tsx', file);
