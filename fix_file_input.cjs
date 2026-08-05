const fs = require('fs');
let file = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const fileHandling = `
                if (input.type === 'file') {
                  return (
                    <div key={inputKey} className={isStyledForm ? \`space-y-1 \${colSpan}\` : \`space-y-2 \${colSpan}\`}>
                      <label className={isStyledForm ? "font-label-sm text-label-sm text-text-muted block" : "font-label-md text-label-md text-on-surface-variant block"}>{input.label}</label>
                      <input 
                        type="file" required={input.required} 
                        onChange={e => handleChange(input.name, e.target.files ? e.target.files[0] : null)} 
                        className={isStyledForm ? "w-full px-4 py-2.5 rounded-lg border border-border-subtle bg-surface-background text-text-main font-body-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none" : "w-full px-4 py-2.5 bg-surface-container-lowest border border-border-subtle rounded-lg font-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"} 
                      />
                    </div>
                  );
                }
`;

file = file.replace(
  "return (\n                  <div key={inputKey}",
  fileHandling + "\n                return (\n                  <div key={inputKey}"
);

fs.writeFileSync('./src/components/PageBlocks.tsx', file);
