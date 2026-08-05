const fs = require('fs');
let file = fs.readFileSync('./src/components/Footer.tsx', 'utf8');

file = file.replace(
  `                <h5 className="font-bold text-base md:text-lg text-primary dark:text-primary-fixed tracking-wide" style={titleStyle}>`,
  `                <h5 className="font-bold text-base md:text-lg text-primary dark:text-primary-fixed tracking-wide capitalize whitespace-nowrap truncate" style={titleStyle} title={col.title}>`
);

file = file.replace(
  `                        className="text-sm text-text-muted dark:text-outline-variant hover:text-primary transition-colors flex items-center gap-1.5"`,
  `                        className="text-sm text-text-muted dark:text-outline-variant hover:text-primary transition-colors flex items-center gap-1.5 capitalize whitespace-nowrap truncate"`
);

file = file.replace(
  `                        {link.label}`,
  `                        <span title={link.label} className="truncate">{link.label}</span>`
);

fs.writeFileSync('./src/components/Footer.tsx', file);
