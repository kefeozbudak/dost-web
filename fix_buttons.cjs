const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  let lines = code.split('\n');
  let changed = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes('px-margin-mobile md:px-margin-desktop') && 
        (line.includes('py-2') || line.includes('py-3') || line.includes('py-4') || line.includes('py-6') || line.includes('px-5')) &&
        (line.includes('rounded-') || line.includes('inline-flex'))) {
      
      // But don't touch section/div containers that just happen to have rounded-3xl and py-12
      if (line.includes('py-section-gap') || line.includes('py-20') || line.includes('py-12') || line.includes('py-10')) {
        continue;
      }
      
      lines[i] = line.replace(/px-margin-mobile md:px-margin-desktop/g, 'px-6 md:px-8');
      lines[i] = lines[i].replace(/md:px-margin-mobile md:px-margin-desktop/g, 'md:px-8');
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, lines.join('\n'));
    console.log("Fixed buttons in " + file);
  }
}

fixFile('src/components/PageBlocks.tsx');
fixFile('src/components/SchoolBlocks.tsx');
fixFile('src/components/Footer.tsx');
fixFile('src/components/Header.tsx');
