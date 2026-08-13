const fs = require('fs');
const file = 'src/components/AboutBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

// The issue is in AboutHeroBlock buttons
// I will just replace the whole button mapping part.
const startIdx = content.indexOf('              {block.buttons.map((btn: any, idx: number) => (');
const endIdx = content.indexOf('              ))}');

if (startIdx !== -1 && endIdx !== -1) {
  const newMapping = `              {block.buttons.map((btn: any, idx: number) => (
                <a key={idx} href={btn.url || "#"} 
                   className={\`px-8 py-3 rounded-xl text-[14px] font-bold transition-colors \${btn.primary !== false ? 'bg-white text-[#1d4eca] hover:opacity-90' : 'border-2 border-white text-white hover:bg-white/10'}\`} 
                   style={getIndividualButtonStyle(btn, block)}>
                  {btn.label}
                </a>`;
  content = content.substring(0, startIdx) + newMapping + content.substring(endIdx);
  fs.writeFileSync(file, content);
  console.log("Fixed AboutBlocks duplicate style");
}
