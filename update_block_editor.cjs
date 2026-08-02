const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const heroFieldsRegex = /(block\.type === 'hero' && \(\s*<div className="space-y-4">)/;

const newFields = `$1
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Görünüm Düzeni</label>
              <select 
                value={block.layoutOrder || 'text_images_buttons'} 
                onChange={(e) => handleChange('layoutOrder', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:border-blue-500"
              >
                <option value="text_images_buttons">Yazı - Resimler - Butonlar</option>
                <option value="images_text_buttons">Resimler - Yazı - Butonlar</option>
                <option value="text_buttons_images">Yazı - Butonlar - Resimler</option>
              </select>
            </div>
`;

if (code.match(heroFieldsRegex)) {
    code = code.replace(heroFieldsRegex, newFields);
    fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
    console.log("Updated BlockFormEditor.tsx!");
} else {
    console.log("Regex not found in BlockFormEditor.tsx!");
}
