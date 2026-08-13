const fs = require('fs');
const file = 'src/lib/styleUtils.ts';
let content = fs.readFileSync(file, 'utf8');

const replacement = `
    const clean = (val: any) => typeof val === 'string' ? val.replace(/px/g, '') : val;
    if (desktopVal !== undefined && desktopVal !== "") {
      style[\`--desktop-\${cssProp}\`] = clean(desktopVal) + unit;
      style[jsProp] = clean(desktopVal) + unit; 
    }
    if (mobileVal !== undefined && mobileVal !== "") {
      style[\`--mobile-\${cssProp}\`] = clean(mobileVal) + unit;
    }
`;

content = content.replace(/if \(desktopVal !== undefined && desktopVal !== ""\) \{\s*style\[`--desktop-\$\{cssProp\}`\] = desktopVal \+ unit;\s*style\[jsProp\] = desktopVal \+ unit;\s*\}\s*if \(mobileVal !== undefined && mobileVal !== ""\) \{\s*style\[`--mobile-\$\{cssProp\}`\] = mobileVal \+ unit;\s*\}/g, replacement);

fs.writeFileSync(file, content);
console.log("Patched styleUtils.ts");
