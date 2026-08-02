import re

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# Add 'color' type to renderArrayEditor definition
code = code.replace("type: 'text' | 'textarea' | 'icon' | 'image' | 'checkbox' | 'url'", "type: 'text' | 'textarea' | 'icon' | 'image' | 'checkbox' | 'url' | 'color'")

# Add handling for 'color' type in renderArrayEditor
color_handling = """                    {field.type === 'url' && (
                      <input 
                        type="text" 
                        value={item[field.key] || ''} 
                        onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} 
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs outline-none" 
                      />
                    )}
                    {field.type === 'color' && (
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" 
                          value={item[field.key] || '#000000'} 
                          onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} 
                          className="w-8 h-8 p-0 border-0 rounded cursor-pointer" 
                        />
                        <input 
                          type="text" 
                          value={item[field.key] || ''} 
                          onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} 
                          className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs outline-none uppercase font-mono"
                          placeholder="#000000"
                        />
                      </div>
                    )}"""

code = code.replace("""                    {field.type === 'url' && (
                      <input 
                        type="text" 
                        value={item[field.key] || ''} 
                        onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} 
                        className="w-full px-2 py-1 border border-slate-200 rounded text-xs outline-none" 
                      />
                    )}""", color_handling)

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)
    
print("Patched renderArrayEditor")
