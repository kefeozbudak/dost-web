const fs = require('fs');

// Fix BlockFormEditor.tsx
let file1 = fs.readFileSync('./src/admin/BlockFormEditor.tsx', 'utf8');

file1 = file1.replace(
  `{renderInputWithStyle('Arka Plan Görseli', 'image')}`,
  `{renderImageUpload('Arka Plan Görseli', 'image')}`
);

file1 = file1.replace(
  `{ key: 'url', label: 'Link URL', type: 'url' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' }`,
  `{ key: 'url', label: 'Link URL', type: 'url' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' },
              { key: 'hideButton', label: 'Butonu Gizle', type: 'checkbox' }`
);

fs.writeFileSync('./src/admin/BlockFormEditor.tsx', file1);

// Fix PageBlocks.tsx
let file2 = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

// Fix hero animation opacity bug
file2 = file2.replace(
  `<h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 animate-fade-in-up" style={getTitleStyle(block)}>`,
  `<h1 className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6" style={getTitleStyle(block)}>`
);

file2 = file2.replace(
  `<p className="font-body-lg text-lg md:text-xl max-w-3xl mx-auto text-surface-bright/90 opacity-0 animate-fade-in-up" style={{...getSubtitleStyle(block), animationDelay: '200ms', animationFillMode: 'forwards'}}>`,
  `<p className="font-body-lg text-lg md:text-xl max-w-3xl mx-auto text-surface-bright/90" style={getSubtitleStyle(block)}>`
);

// Fix hide button in EduSystemLevelsBlock
file2 = file2.replace(
  `{item.url && (
                <SmartLink className=\`inline-flex items-center font-label-md font-semibold hover:opacity-80 group/link \${isPrimary ? 'text-primary' : 'text-secondary'}\` url={item.url}>
                  {item.buttonText || 'Detaylı Bilgi'}
                  <span className="material-symbols-outlined text-sm ml-1 group-hover/link:translate-x-1 transition-transform" translate="no" aria-hidden="true">arrow_forward</span>
                </SmartLink>
              )}`,
  `{item.url && !item.hideButton && (
                <SmartLink className=\`inline-flex items-center font-label-md font-semibold hover:opacity-80 group/link \${isPrimary ? 'text-primary' : 'text-secondary'}\` url={item.url}>
                  {item.buttonText || 'Detaylı Bilgi'}
                  <span className="material-symbols-outlined text-sm ml-1 group-hover/link:translate-x-1 transition-transform" translate="no" aria-hidden="true">arrow_forward</span>
                </SmartLink>
              )}`
);

fs.writeFileSync('./src/components/PageBlocks.tsx', file2);

