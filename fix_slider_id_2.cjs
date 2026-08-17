const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf-8');

const badHTML = `<input
            type="checkbox"
            checked={block.styles?.enableDarkOverlay || false}
            onChange={(e) => handleStyleChange("enableDarkOverlay", e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            
          />
          <label  className="text-sm font-bold text-slate-700 cursor-pointer">
            Karanlık Katman Uygula (Görsellerin üzerine yarı saydam karanlık filtre ekler)
          </label>`;

const goodHTML = `<label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={block.styles?.enableDarkOverlay || false}
            onChange={(e) => handleStyleChange("enableDarkOverlay", e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-bold text-slate-700">
            Karanlık Katman Uygula (Görsellerin üzerine yarı saydam karanlık filtre ekler)
          </span>
        </label>`;

if (content.includes(badHTML)) {
  // It won't match exactly probably because of spacing. Let's use regex
}

content = content.replace(/<div className="flex items-center gap-2">\s*<input\s*type="checkbox"\s*checked=\{block\.styles\?\.enableDarkOverlay \|\| false\}\s*onChange=\{\(e\) => handleStyleChange\("enableDarkOverlay", e\.target\.checked\)\}\s*className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"\s*\/>\s*<label  className="text-sm font-bold text-slate-700 cursor-pointer">\s*Karanlık Katman Uygula[^\n]*\s*<\/label>\s*<\/div>/g, goodHTML);


fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
