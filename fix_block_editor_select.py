with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

# Update signature
old_sig = "itemFields: {key: string, label: string, type: 'text' | 'textarea' | 'icon' | 'image' | 'checkbox' | 'url' | 'color'}[]"
new_sig = "itemFields: {key: string, label: string, type: 'text' | 'textarea' | 'icon' | 'image' | 'checkbox' | 'url' | 'color' | 'select', options?: {value: string, label: string}[]}[]"
code = code.replace(old_sig, new_sig)

# Add select renderer
old_text = "              if (field.type === 'text') {"
new_text = """              if (field.type === 'select') {
                return (
                  <div key={field.key} className="flex flex-col gap-1 mt-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</label>
                    <select
                      value={item[field.key] || ''}
                      onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Seçiniz...</option>
                      {(field.options || []).map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              if (field.type === 'text') {"""
code = code.replace(old_text, new_text)

# Find where items for news_grid are rendered
# We need to change {key: 'tag', label: 'Kategori Etiketi (Rozet)', type: 'text'},
# to a select using block.categories
marker = "{key: 'tag', label: 'Kategori Etiketi (Rozet)', type: 'text'},"
if marker in code:
    code = code.replace(
        marker,
        "{key: 'tag', label: 'Kategori Seç (Rozet)', type: 'select', options: (block.categories || []).filter((c: any) => c.label !== 'Tümü').map((c: any) => ({value: c.label || c, label: c.label || c}))},"
    )
    print("Replaced tag text field with select field.")
else:
    print("Could not find tag text field marker.")

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code)
print("Updated BlockFormEditor.tsx")
