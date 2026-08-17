const fs = require('fs');
let code = fs.readFileSync('src/lib/styleUtils.ts', 'utf8');

const target = `    if (desktopVal !== undefined && desktopVal !== "") {
      style[\`--desktop-\${cssProp}\`] = clean(desktopVal) + unit;
      style[jsProp] = clean(desktopVal) + unit; 
    }
    if (mobileVal !== undefined && mobileVal !== "") {
      style[\`--mobile-\${cssProp}\`] = clean(mobileVal) + unit;
    }`;

const replacement = `    if (cssProp === 'text-align' && (mobileVal === undefined || mobileVal === "")) {
      mobileVal = 'center';
    }
    
    if (desktopVal !== undefined && desktopVal !== "") {
      style[\`--desktop-\${cssProp}\`] = clean(desktopVal) + unit;
      style[jsProp] = clean(desktopVal) + unit; 
    }
    if (mobileVal !== undefined && mobileVal !== "") {
      style[\`--mobile-\${cssProp}\`] = clean(mobileVal) + unit;
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/lib/styleUtils.ts', code);
console.log("Patched");
