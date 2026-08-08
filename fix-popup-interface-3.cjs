const fs = require('fs');
let code = fs.readFileSync('src/components/PopupOverlay.tsx', 'utf8');

code = code.replace(/style\?: \{\s*bgColor\?: string;\s*textColor\?: string;\s*buttonBgColor\?: string;\s*buttonTextColor\?: string;\s*borderRadius\?: string;\s*shadow\?: string;\s*\};/, `style?: {
    bgColor?: string;
    textColor?: string;
    titleColor?: string;
    descColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    borderRadius?: string;
    shadow?: string;
  };`);

fs.writeFileSync('src/components/PopupOverlay.tsx', code);
console.log("Updated PopupOverlay interface");
