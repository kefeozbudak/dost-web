const fs = require('fs');
let content = fs.readFileSync('src/components/IconField.tsx', 'utf8');

content = content.replace(
  /if \(cleanName\.trim\(\)\.toLowerCase\(\)\.startsWith\('<svg'\)\) \{/g,
  `if (cleanName.trim().toLowerCase().includes('<svg')) {`
);

fs.writeFileSync('src/components/IconField.tsx', content);
console.log("Patched IconField.tsx");
