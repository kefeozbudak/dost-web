import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

old_code = """              <div key={i} className="flex flex-col gap-2 mb-3 bg-slate-50 p-3 border border-slate-200 rounded-lg relative">
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleArrayChange('items', i, 'title', e.target.value)}
                  placeholder="Kampüs Adı"
                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded mb-1"
                />
                <div className="mb-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kampüs Linki (Etikete Tıklanınca Gidilecek Sayfa)</label>
                  {renderUrlEditor(item.url || '', (val) => handleArrayChange('items', i, 'url', val))}
                </div>"""

new_code = """              <div key={i} className="flex flex-col gap-2 mb-3 bg-slate-50 p-3 border border-slate-200 rounded-lg relative">
                <input
                  type="text"
                  value={item.title || ''}
                  onChange={(e) => handleArrayChange('items', i, 'title', e.target.value)}
                  placeholder="Kampüs Adı (Etiket)"
                  className="w-full px-2 py-1 text-sm border border-slate-300 rounded mb-1"
                />
                {renderImageUploadArray('Kampüs Resmi', 'items', i, 'image')}
                <div className="mb-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Kampüs Linki (Etikete Tıklanınca Gidilecek Sayfa)</label>
                  {renderUrlEditor(item.url || '', (val) => handleArrayChange('items', i, 'url', val))}
                </div>"""

content = content.replace(old_code, new_code)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
