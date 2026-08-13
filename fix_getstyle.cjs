const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const oldFunc = `    const addResponsiveVar = (cssProp: string, jsProp: string, suffix: string, unit: string = "") => {
      let desktopVal = block.styles?.[prefix + suffix] || (prefix === "" || prefix === "container" ? block.styles?.[suffix.charAt(0).toLowerCase() + suffix.slice(1)] : undefined);
      let mobileVal = block.styles?.[prefix + "Mobile" + suffix] || (prefix === "" || prefix === "container" ? block.styles?.["mobile" + suffix] : undefined);
      
      // FIX: If it's a size property and it's 0 or 0px, treat it as undefined so it falls back to CSS classes.
      if (cssProp === 'font-size') { 
        if (desktopVal === '0' || desktopVal === '0px' || desktopVal === 0) desktopVal = undefined;
        if (mobileVal === '0' || mobileVal === '0px' || mobileVal === 0) mobileVal = undefined;
      }

      if (mobileVal !== undefined && mobileVal !== "") {
        style[\`--desktop-\${cssProp}\`] = desktopVal ? desktopVal + unit : (unit === "px" ? "0px" : "inherit");
        style[\`--mobile-\${cssProp}\`] = mobileVal + unit;
      } else if (desktopVal !== undefined && desktopVal !== "") {
        style[jsProp] = desktopVal + unit;
      }
    };`;

const newFunc = `    const addResponsiveVar = (cssProp: string, jsProp: string, suffix: string, unit: string = "") => {
      let desktopVal = block.styles?.[prefix + suffix] || (prefix === "" || prefix === "container" ? block.styles?.[suffix.charAt(0).toLowerCase() + suffix.slice(1)] : undefined);
      let mobileVal = block.styles?.[prefix + "Mobile" + suffix] || (prefix === "" || prefix === "container" ? block.styles?.["mobile" + suffix] : undefined);
      
      if (cssProp === 'font-size') { 
        if (desktopVal === '0' || desktopVal === '0px' || desktopVal === 0) desktopVal = undefined;
        if (mobileVal === '0' || mobileVal === '0px' || mobileVal === 0) mobileVal = undefined;
      }

      if (desktopVal !== undefined && desktopVal !== "") {
        style[\`--desktop-\${cssProp}\`] = desktopVal + unit;
        style[jsProp] = desktopVal + unit; // For fallback
      }
      
      if (mobileVal !== undefined && mobileVal !== "") {
        style[\`--mobile-\${cssProp}\`] = mobileVal + unit;
      }
    };`;

content = content.replace(oldFunc, newFunc);
fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched getStyle");
