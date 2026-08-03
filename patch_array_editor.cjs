const fs = require('fs');

let block_editor = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

// We use regex to find and replace.
let replaced = block_editor.replace(
    /\{\(block\[arrayKey\] \|\| \[\]\)\.map\(\(item: any, idx: number\) => \(\s*<div\s*key=\{idx\}\s*draggable\s*onDragStart=\{\(e\) => handleDragStart\(e, idx\)\}\s*onDragOver=\{\(e\) => e\.preventDefault\(\)\}\s*onDrop=\{\(e\) => handleDrop\(e, idx\)\}\s*className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2 relative cursor-move"\s*>\s*<GripVertical className="w-4 h-4 text-slate-300 mt-2 shrink-0 cursor-move" \/>\s*<div className="flex-1 space-y-2">/,
    `{(block[arrayKey] || []).map((item: any, idx: number) => (
        <details 
          key={idx} 
          ref={(el) => { arrayItemRefs.current[\`\${arrayKey}-\${idx}\`] = el; }}
          className="group/item bg-slate-50 rounded-lg border border-slate-200 mb-2"
        >
          <summary className="flex gap-2 items-center p-3 cursor-pointer list-none select-none">
            <span className="material-symbols-outlined text-[16px] text-slate-400 group-open/item:rotate-90 transition-transform">chevron_right</span>
            <div className="flex-1 font-bold text-xs text-slate-600 truncate">{typeof item === 'string' ? item : (item.title || item.label || item.day || item.name || item.text || \`Öğe \${idx + 1}\`)}</div>
            <GripVertical className="w-4 h-4 text-slate-300 cursor-move" draggable onDragStart={(e) => handleDragStart(e, idx)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, idx)} onClick={(e) => e.preventDefault()} />
          </summary>
          <div className="p-3 pt-0 border-t border-slate-200 flex gap-2 items-start mt-2">
            <div className="flex-1 space-y-2">`
);

replaced = replaced.replace(
    /<\button onClick=\{\(\) => \{\s*const newItems = \[\.\.\.\(block\[arrayKey\] \|\| \[\]\)\];\s*newItems\.splice\(idx, 1\);\s*handleChange\(arrayKey, newItems\);\s*\}\} className="text-red-500 hover:text-red-700 p-1">Sil<\/button>\s*<\/div>\s*\)\)\}/,
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
