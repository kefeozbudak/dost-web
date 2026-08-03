const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

content = content.replace(
    /\{key: 'url', label: 'Link URL', type: 'url'\}/,
    `{key: 'url', label: 'Link URL', type: 'url'},
              {key: 'buttonText', label: 'Buton Yazısı (Örn: Detaylı Bilgi)', type: 'text'},
              {key: 'buttonUrl', label: 'Buton Linki', type: 'url'}`
);

content = content.replace(
    /<span className="text-\[10px\] text-slate-500 font-bold flex items-center uppercase ml-2">Açıklama Stili:<\/span>\s*<FieldStylePicker block=\{block\} fieldKey="itemDesc" onChange=\{handleStyleChange\} \/>/,
    `<span className="text-[10px] text-slate-500 font-bold flex items-center uppercase ml-2">Açıklama Stili:</span>
            <FieldStylePicker block={block} fieldKey="itemDesc" onChange={handleStyleChange} />
            <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase ml-2">Buton Stili:</span>
            <FieldStylePicker block={block} fieldKey="itemButton" onChange={handleStyleChange} />`
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Patched BlockFormEditor");
