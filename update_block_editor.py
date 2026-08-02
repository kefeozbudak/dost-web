import sys

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

header = """      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">Modül Düzenleyici</h3>
      </div>"""

replacement = """      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">Modül Düzenleyici</h3>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-600 cursor-pointer">
          <input 
            type="checkbox" 
            checked={!block.isHidden} 
            onChange={(e) => handleChange('isHidden', !e.target.checked)} 
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span className={block.isHidden ? "text-slate-400" : "text-blue-600"}>
            {block.isHidden ? "Gizli" : "Görünür"}
          </span>
        </label>
      </div>"""

if header in code:
    code = code.replace(header, replacement)
    with open('src/admin/BlockFormEditor.tsx', 'w') as f:
        f.write(code)
    print("Success")
else:
    print("Could not find the header to replace.")
