const fs = require('fs');

// 1. Modify IconField.tsx
let iconField = fs.readFileSync('src/components/IconField.tsx', 'utf8');

// We need to inject the data attribute logic.
// Find:
//   const cleanName = name.replace(/^lucide:/i, '');
const injection = `
  const dAlign = style?.['--desktop-text-align'];
  const mAlign = style?.['--mobile-text-align'];
  const customDataProps: any = {};
  if (dAlign) customDataProps['data-desktop-align'] = dAlign.replace('px', '').trim();
  if (mAlign) customDataProps['data-mobile-align'] = mAlign.replace('px', '').trim();
`;

iconField = iconField.replace(
  /const cleanName = name\.replace\(\/\^lucide:\/i, ''\);/,
  `const cleanName = name.replace(/^lucide:/i, '');\n${injection}`
);

iconField = iconField.replace(
  /<span className=\{\`inline-flex items-center justify-center \$\{className \|\| ''\}\`\}/,
  `<span {...customDataProps} className={\`inline-flex items-center justify-center \${className || ''}\`}`
);

iconField = iconField.replace(
  /<Icon className=\{className\} color=\{color\} size=\{size\} style=\{style\} \/>/,
  `<Icon {...customDataProps} className={className} color={color} size={size} style={style} />`
);

iconField = iconField.replace(
  /<span className=\{\`material-symbols-outlined \$\{className \|\| ''\}\`\}/,
  `<span {...customDataProps} className={\`material-symbols-outlined \${className || ''}\`}`
);

fs.writeFileSync('src/components/IconField.tsx', iconField);


// 2. Modify index.css
let indexCss = fs.readFileSync('src/index.css', 'utf8');

const cssRules = `
/* Icon Alignment Fixes */
*:has(> [data-mobile-align="center"]) { margin-left: auto !important; margin-right: auto !important; justify-content: center; }
*:has(> [data-mobile-align="left"]) { margin-left: 0 !important; margin-right: auto !important; justify-content: flex-start; }
*:has(> [data-mobile-align="right"]) { margin-left: auto !important; margin-right: 0 !important; justify-content: flex-end; }

[data-mobile-align="center"] { margin-left: auto !important; margin-right: auto !important; display: block !important; text-align: center !important; }
[data-mobile-align="left"] { margin-left: 0 !important; margin-right: auto !important; display: block !important; text-align: left !important; }
[data-mobile-align="right"] { margin-left: auto !important; margin-right: 0 !important; display: block !important; text-align: right !important; }

@media (min-width: 1025px) {
  *:has(> [data-desktop-align="center"]) { margin-left: auto !important; margin-right: auto !important; justify-content: center; }
  *:has(> [data-desktop-align="left"]) { margin-left: 0 !important; margin-right: auto !important; justify-content: flex-start; }
  *:has(> [data-desktop-align="right"]) { margin-left: auto !important; margin-right: 0 !important; justify-content: flex-end; }

  [data-desktop-align="center"] { margin-left: auto !important; margin-right: auto !important; display: block !important; text-align: center !important; }
  [data-desktop-align="left"] { margin-left: 0 !important; margin-right: auto !important; display: block !important; text-align: left !important; }
  [data-desktop-align="right"] { margin-left: auto !important; margin-right: 0 !important; display: block !important; text-align: right !important; }
}
`;

indexCss += `\n${cssRules}`;

fs.writeFileSync('src/index.css', indexCss);
