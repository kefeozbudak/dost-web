const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

// Insert the FieldStylePicker for icon after the one for itemButton.
// Around line 397:
/*
              <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase ml-2">
                Buton Stili:
              </span>
              <FieldStylePicker
                block={block}
                fieldKey="itemButton"
                onChange={handleStyleChange}
              />
*/

code = code.replace(/fieldKey="itemButton"\n\s*onChange=\{handleStyleChange\}\n\s*\/>/,
`fieldKey="itemButton"
                onChange={handleStyleChange}
              />
              <span className="text-[10px] text-slate-500 font-bold flex items-center uppercase ml-2">
                İkon Stili:
              </span>
              <FieldStylePicker
                block={block}
                fieldKey="icon"
                onChange={handleStyleChange}
              />`
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
