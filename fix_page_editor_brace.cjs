const fs = require('fs');
let code = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const target = `            }
        }
        
        if (bestMatch) {
            setSelectedBlockIndex(blockIndex);`;

const replacement = `            }
          }
        } // Close if (!found)
        
        if (bestMatch) {
            setSelectedBlockIndex(blockIndex);`;

code = code.replace(target, replacement);

fs.writeFileSync('src/admin/PageEditor.tsx', code);
