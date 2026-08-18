const fs = require('fs');
let code = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const target = `            }
          }
        } // Close if (!found)
        
        if (bestMatch) {
            setSelectedBlockIndex(blockIndex);`;

const target2 = `            }
          }
        }
        
        if (bestMatch) {
            setActiveArrayItem(bestMatch);`;

code = code.replace(target2, `            }
          }
        } }
        
        if (bestMatch) {
            setActiveArrayItem(bestMatch);`);

fs.writeFileSync('src/admin/PageEditor.tsx', code);
