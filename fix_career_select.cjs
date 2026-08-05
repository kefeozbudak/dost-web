const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const oldSelect = `                if (input.type === 'select') {
                  const opts = (input.options || "").split(',').map((o: string) => o.trim());`;

const newSelect = `                if (input.type === 'select') {
                  let opts = (input.options || "").split(',').map((o: string) => o.trim());
                  
                  // Auto-populate career form positions if available
                  if (type === 'career_application' && input.name === 'position' && block.items && block.items.length > 0) {
                     opts = block.items.map((pos: any) => pos.title || pos.val || "Pozisyon");
                     opts.push("Diğer / Genel Başvuru");
                  }
`;

file = file.replace(oldSelect, newSelect);

fs.writeFileSync('./src/components/PageBlocks.tsx', file);
