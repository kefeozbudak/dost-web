const fs = require('fs');
let file2 = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

const targetStr = `{item.url && (
                <SmartLink className={\`inline-flex items-center font-label-md font-semibold hover:opacity-80 group/link \${isPrimary ? 'text-primary' : 'text-secondary'}\`} url={item.url}>
                  {item.buttonText || 'Detaylı Bilgi'}
                  <span className="material-symbols-outlined text-sm ml-1 group-hover/link:translate-x-1 transition-transform" translate="no" aria-hidden="true">arrow_forward</span>
                </SmartLink>
              )}`;

const targetStr2 = `{item.url && (
                <SmartLink className=\`inline-flex items-center font-label-md font-semibold hover:opacity-80 group/link \${isPrimary ? 'text-primary' : 'text-secondary'}\` url={item.url}>`;

// Let's just find "item.url && (" near "Detaylı Bilgi" and replace it
file2 = file2.replace(
  "{item.url && (\n                <SmartLink",
  "{item.url && !item.hideButton && (\n                <SmartLink"
);

fs.writeFileSync('./src/components/PageBlocks.tsx', file2);
