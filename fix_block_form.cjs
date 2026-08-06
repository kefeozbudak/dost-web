const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const injection = `
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Arkaplan Görseli</label>
              <div className="flex gap-2">
                <input type="text" value={block.styles?.backgroundImage || ''} onChange={e => handleChange('styles', { ...block.styles, backgroundImage: e.target.value })} className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white" placeholder="https://..." />
                <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange('styles', { ...block.styles, backgroundImage: url || '' }) })} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap shadow-sm transition-colors">Seç</button>
              </div>
            </div>
`;

// Insert the new fields before "Genel Metin Hizalaması"
content = content.replace(/<div>\s*<label className="block text-\[10px\] font-bold text-slate-400 uppercase tracking-wider mb-1">Genel Metin Hizalaması<\/label>/,
  injection + '\n            <div>\n              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Genel Metin Hizalaması</label>'
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Updated BlockFormEditor with background image");
