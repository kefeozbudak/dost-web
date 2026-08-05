const fs = require('fs');

const fixMaterialSymbols = (filePath) => {
  let file = fs.readFileSync(filePath, 'utf8');
  file = file.replace(/className="([^"]*material-symbols-outlined[^"]*)"(?! translate)/g, 'className="$1" translate="no" aria-hidden="true"');
  file = file.replace(/className=\{`([^`]*material-symbols-outlined[^`]*)`\}(?! translate)/g, 'className={`$1`} translate="no" aria-hidden="true"');
  fs.writeFileSync(filePath, file);
};

['./src/components/IconField.tsx', './src/components/Header.tsx', './src/components/Footer.tsx', './src/components/PageBlocks.tsx'].forEach(fixMaterialSymbols);
