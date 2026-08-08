const fs = require('fs');
let code = fs.readFileSync('src/components/PopupOverlay.tsx', 'utf8');

code = code.replace(/style\?: \{\s*bgColor\?: string;\s*textColor\?: string;\s*buttonBgColor\?: string;\s*buttonTextColor\?: string;\s*\};/, `style?: {
    bgColor?: string;
    textColor?: string;
    titleColor?: string;
    descColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
  };`);

// Check if imagePosition includes 'bottom'
code = code.replace(/imagePosition\?: 'left' \| 'top' \| 'right' \| 'bg';/, `imagePosition?: 'left' | 'top' | 'right' | 'bottom' | 'bg';`);

fs.writeFileSync('src/components/PopupOverlay.tsx', code);
console.log("Updated PopupOverlay types");
