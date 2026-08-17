const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf8');

const target = `--text-body-lg: 18px;
  --text-body-lg--line-height: 1.6;
  --text-body-lg--font-weight: 400;
  
  --text-headline-xl: clamp(24px, 3.5vw, 32px);
  --text-headline-xl--line-height: 1.3;
  --text-headline-xl--font-weight: 700;
  
  --text-headline-md: 24px;
  --text-headline-md--line-height: 1.4;
  --text-headline-md--font-weight: 700;
  
  --text-body-md: 16px;
  --text-body-md--line-height: 1.6;
  --text-body-md--font-weight: 400;
  
  --text-display-lg: clamp(28px, 4vw, 36px);
  --text-display-lg--line-height: 1.2;
  --text-display-lg--letter-spacing: -0.02em;
  --text-display-lg--font-weight: 800;`;

const replacement = `--text-body-lg: clamp(16px, 1vw + 12px, 18px);
  --text-body-lg--line-height: 1.6;
  --text-body-lg--font-weight: 400;
  
  --text-headline-xl: clamp(24px, 2.5vw + 14px, 36px);
  --text-headline-xl--line-height: 1.3;
  --text-headline-xl--font-weight: 700;
  
  --text-headline-md: clamp(20px, 2vw + 14px, 28px);
  --text-headline-md--line-height: 1.4;
  --text-headline-md--font-weight: 700;
  
  --text-body-md: 16px;
  --text-body-md--line-height: 1.6;
  --text-body-md--font-weight: 400;
  
  --text-display-lg: clamp(28px, 3vw + 16px, 48px);
  --text-display-lg--line-height: 1.2;
  --text-display-lg--letter-spacing: -0.02em;
  --text-display-lg--font-weight: 800;`;

code = code.replace(target, replacement);
fs.writeFileSync('src/index.css', code);
console.log("Patched CSS Typography");
