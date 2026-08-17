const fs = require('fs');

function fixFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  let lines = code.split('\n');
  let changed = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // We want to target lines that have buttons, meaning they have px-6 md:px-8 and py-something
    if (line.includes('px-6 md:px-8') && (line.includes('py-3') || line.includes('py-4'))) {
      
      // If it doesn't already have w-full or flex or inline-flex, we should maybe add inline-flex items-center justify-center w-full sm:w-auto
      // Let's replace 'px-6 md:px-8 py-3 ' with 'w-full sm:w-auto justify-center text-center px-6 md:px-8 py-3.5 '
      // Wait, py-3 is already 12px, which is good. py-4 is 16px.
      
      // Fix py-4 -> py-3.5 md:py-4
      if (line.includes('py-4 ') && !line.includes('md:py-4')) {
        line = line.replace('py-4 ', 'py-3.5 md:py-4 ');
      }
      
      // Fix py-3 -> py-3 md:py-3.5
      if (line.includes('py-3 ') && !line.includes('md:py-3')) {
        line = line.replace('py-3 ', 'py-3 md:py-3.5 ');
      }

      // Add w-full sm:w-auto if not present
      if (!line.includes('w-full') && !line.includes('w-12')) { // w-12 is for icon buttons
         // safely inject it after className=" or className={`
         line = line.replace('className="', 'className="w-full sm:w-auto justify-center text-center ');
         line = line.replace('className={`', 'className={`w-full sm:w-auto justify-center text-center ');
      }
      
      // Ensure flex or inline-flex so justify-center works
      if (!line.includes('flex') && !line.includes('inline-flex')) {
         line = line.replace('className="', 'className="inline-flex items-center ');
         line = line.replace('className={`', 'className={`inline-flex items-center ');
      }
      
      lines[i] = line;
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, lines.join('\n'));
    console.log("Made buttons responsive in " + file);
  }
}

fixFile('src/components/PageBlocks.tsx');
fixFile('src/components/SchoolBlocks.tsx');
fixFile('src/components/Footer.tsx');
