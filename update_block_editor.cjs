const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const alignFields = `            {block.type.includes('hero') && (
              <div className="col-span-2 grid grid-cols-2 gap-4 border-t border-slate-100 pt-3 mt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hero İçerik Yatay Konumu</label>
                  <select 
                    value={block.styles?.heroAlignX || ''}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), heroAlignX: e.target.value };
                      handleChange('styles', newStyles);
                    }}
                    className="w-full text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                  >
                    <option value="">Varsayılan (Sola Dayalı)</option>
                    <option value="left">Sola Dayalı</option>
                    <option value="center">Ortala</option>
                    <option value="right">Sağa Dayalı</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Hero İçerik Dikey Konumu</label>
                  <select 
                    value={block.styles?.heroAlignY || ''}
                    onChange={(e) => {
                      const newStyles = { ...(block.styles || {}), heroAlignY: e.target.value };
                      handleChange('styles', newStyles);
                    }}
                    className="w-full text-sm border-slate-300 rounded p-1.5 outline-none focus:border-blue-500"
                  >
                    <option value="">Varsayılan (Ortala)</option>
                    <option value="top">Üste Yakın</option>
                    <option value="center">Ortala</option>
                    <option value="bottom">Alta Yakın</option>
                  </select>
                </div>
              </div>
            )}
`;

content = content.replace(/<label className="block text-\[10px\] font-bold text-slate-400 uppercase tracking-wider mb-1">Genel Metin Hizalaması<\/label>/, alignFields + '\n            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Genel Metin Hizalaması</label>');

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Added hero alignment fields");
