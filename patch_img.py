import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

# renderImageUpload
target1 = r"""          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 rounded-md cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <ImageIcon className="w-4 h-4 text-slate-600" />
            <input type="file" accept="image/\*" onChange=\{handleFileChange\} className="hidden" />
          </label>"""

replacement1 = r"""          <button 
            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url) })}
            className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 rounded-md cursor-pointer transition-colors" 
            title="Medya Kütüphanesinden Seç"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 rounded-md cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <Plus className="w-4 h-4 text-slate-600" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>"""
content = re.sub(target1, replacement1, content)

# renderImageUploadArray
target2 = r"""          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 rounded cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <ImageIcon className="w-3 h-3 text-slate-600" />
            <input type="file" accept="image/\*" onChange=\{handleFileChange\} className="hidden" />
          </label>"""

replacement2 = r"""          <button 
            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleArrayChange(arrayKey, index, itemKey, url) })}
            className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-2 rounded cursor-pointer transition-colors" 
            title="Medya Kütüphanesinden Seç"
          >
            <ImageIcon className="w-3 h-3" />
          </button>
          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 rounded cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <Plus className="w-3 h-3 text-slate-600" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>"""
content = re.sub(target2, replacement2, content)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
