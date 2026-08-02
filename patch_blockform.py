import re

with open('src/admin/BlockFormEditor.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

render_image_upload = """  const renderImageUpload = (label: string, key: string) => (
    <div className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        <input type="text" value={block[key] || ''} onChange={e => handleChange(key, e.target.value)} className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 bg-white" placeholder="https://..." />
        <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url) })} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap shadow-sm transition-colors">Seç</button>
      </div>
      {block[key] && (
        <div className="grid grid-cols-3 gap-3 mt-2 pt-3 border-t border-slate-200">
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Sol/Sağ (X %)</label>
            <input type="number" min="0" max="100" value={block[`${key}_posX`] ?? 50} onChange={(e) => handleChange(`${key}_posX`, Number(e.target.value))} className="w-full text-xs border border-slate-300 rounded p-1.5 text-center bg-white" />
          </div>
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Üst/Alt (Y %)</label>
            <input type="number" min="0" max="100" value={block[`${key}_posY`] ?? 50} onChange={(e) => handleChange(`${key}_posY`, Number(e.target.value))} className="w-full text-xs border border-slate-300 rounded p-1.5 text-center bg-white" />
          </div>
          <div>
            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Yakınlaştır (%)</label>
            <input type="number" min="10" max="500" value={block[`${key}_scale`] ?? 100} onChange={(e) => handleChange(`${key}_scale`, Number(e.target.value))} className="w-full text-xs border border-slate-300 rounded p-1.5 text-center bg-white" />
          </div>
        </div>
      )}
    </div>
  );"""

# Replace renderImageUpload
old_render_image = """  const renderImageUpload = (label: string, key: string) => (
    <div>
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex gap-2">
        <input type="text" value={block[key] || ''} onChange={e => handleChange(key, e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none" />
        <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url) })} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md font-bold text-xs whitespace-nowrap">Seç</button>
      </div>
    </div>
  );"""

content = content.replace(old_render_image, render_image_upload)

array_image_field = """              if (field.type === 'image') {
                return (
                  <div key={field.key} className="flex flex-col gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
                    <div className="flex gap-2">
                      <input type="text" value={item[field.key] || ''} onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} className="flex-1 text-sm border border-slate-300 rounded p-1.5 focus:ring-1 focus:ring-blue-500 bg-white" placeholder="https://..." />
                      <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleArrayChange(arrayKey, idx, field.key, url) })} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[11px] font-bold shadow-sm transition-colors">Seç</button>
                    </div>
                    {item[field.key] && (
                      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-200">
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Sol/Sağ (X %)</label>
                          <input type="number" min="0" max="100" value={item[`${field.key}_posX`] ?? 50} onChange={(e) => handleArrayChange(arrayKey, idx, `${field.key}_posX`, Number(e.target.value))} className="w-full text-xs border border-slate-300 rounded p-1 text-center bg-white" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Üst/Alt (Y %)</label>
                          <input type="number" min="0" max="100" value={item[`${field.key}_posY`] ?? 50} onChange={(e) => handleArrayChange(arrayKey, idx, `${field.key}_posY`, Number(e.target.value))} className="w-full text-xs border border-slate-300 rounded p-1 text-center bg-white" />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Yakınlaştır (%)</label>
                          <input type="number" min="10" max="500" value={item[`${field.key}_scale`] ?? 100} onChange={(e) => handleArrayChange(arrayKey, idx, `${field.key}_scale`, Number(e.target.value))} className="w-full text-xs border border-slate-300 rounded p-1 text-center bg-white" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              }"""

old_array_image = """              if (field.type === 'image') {
                return (
                  <div key={field.key} className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{field.label}</label>
                    <div className="flex gap-2">
                      <input type="text" value={item[field.key] || ''} onChange={(e) => handleArrayChange(arrayKey, idx, field.key, e.target.value)} className="flex-1 text-sm border-slate-300 rounded p-1.5" />
                      <button type="button" onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleArrayChange(arrayKey, idx, field.key, url) })} className="bg-blue-600 text-white px-2 py-1 rounded text-[10px] font-bold">Seç</button>
                    </div>
                  </div>
                );
              }"""

content = content.replace(old_array_image, array_image_field)

with open('src/admin/BlockFormEditor.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
