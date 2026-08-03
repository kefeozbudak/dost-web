const fs = require('fs');
let block_editor = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

let replaced = block_editor.replace(
    /          <button onClick=\{\(\) => \{\s*const newItems = \[\.\.\.\(block\[arrayKey\] \|\| \[\]\)\];\s*newItems\.splice\(idx, 1\);\s*handleChange\(arrayKey, newItems\);\s*\}\} className="text-red-500 hover:text-red-700 p-1">Sil<\/button>\s*<\/div>\s*\)\)\}/,
    `         <button onClick={() => {
            const newItems = [...(block[arrayKey] || [])];
            newItems.splice(idx, 1);
            handleChange(arrayKey, newItems);
          }} className="text-red-500 hover:text-red-700 p-1 text-xs font-bold mt-2">Sil</button>
          </div>
        </details>
      ))}`
);

if (replaced !== block_editor) {
    fs.writeFileSync('src/admin/BlockFormEditor.tsx', replaced);
    console.log("Patched successfully");
} else {
    console.log("Regex didn't match");
}
