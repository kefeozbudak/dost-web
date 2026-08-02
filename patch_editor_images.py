import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

old_renderImageUpload = """  const renderImageUpload = (label: string, key: string) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const compressed = await compressImage(file);
          handleChange(key, compressed);
        } catch (err) {
          console.error("Resim yüklenemedi", err);
          alert("Resim yüklenirken bir hata oluştu.");
        }
      }
    };

    return (
      <div className="mb-4 bg-white p-2 rounded border border-slate-100 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={block[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder="Resim URL'si veya Dosya Seçin"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url) })}
            className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 rounded-md cursor-pointer transition-colors" 
            title="Medya Kütüphanesinden Seç"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 rounded-md cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <Plus className="w-4 h-4 text-slate-600" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>"""

new_renderImageUpload = """  const renderImageUpload = (label: string, key: string) => {
    return (
      <div className="mb-4 bg-white p-2 rounded border border-slate-100 shadow-sm">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={block[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            placeholder="Resim URL'si veya Medya Seçin"
            className="flex-1 px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url) })}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 rounded-md cursor-pointer transition-colors font-bold text-xs shadow-sm whitespace-nowrap" 
            title="Medya Kütüphanesinden Seç"
          >
            <ImageIcon className="w-4 h-4" /> Medya Ekle
          </button>
        </div>"""

content = content.replace(old_renderImageUpload, new_renderImageUpload)

old_renderImageUploadArray = """  const renderImageUploadArray = (label: string, arrayKey: string, index: number, itemKey: string) => {
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        try {
          const compressed = await compressImage(file);
          handleArrayChange(arrayKey, index, itemKey, compressed);
        } catch (err) {
          console.error("Resim yüklenemedi", err);
          alert("Resim yüklenirken bir hata oluştu.");
        }
      }
    };

    const item = block[arrayKey]?.[index] || {};

    return (
      <div className="mb-2 bg-slate-50 p-2 rounded border border-slate-100">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={item[itemKey] || ''}
            onChange={(e) => handleArrayChange(arrayKey, index, itemKey, e.target.value)}
            placeholder="Resim URL'si veya Dosya Seçin"
            className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleArrayChange(arrayKey, index, itemKey, url) })}
            className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-2 rounded cursor-pointer transition-colors" 
            title="Medya Kütüphanesinden Seç"
          >
            <ImageIcon className="w-3 h-3" />
          </button>
          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 rounded cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <Plus className="w-3 h-3 text-slate-600" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        </div>"""

new_renderImageUploadArray = """  const renderImageUploadArray = (label: string, arrayKey: string, index: number, itemKey: string) => {
    const item = block[arrayKey]?.[index] || {};

    return (
      <div className="mb-2 bg-slate-50 p-2 rounded border border-slate-100">
        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={item[itemKey] || ''}
            onChange={(e) => handleArrayChange(arrayKey, index, itemKey, e.target.value)}
            placeholder="Resim URL'si veya Medya Seçin"
            className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleArrayChange(arrayKey, index, itemKey, url) })}
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded cursor-pointer transition-colors font-bold text-[10px] shadow-sm whitespace-nowrap" 
            title="Medya Kütüphanesinden Seç"
          >
            <ImageIcon className="w-3 h-3" /> Medya Ekle
          </button>
        </div>"""

content = content.replace(old_renderImageUploadArray, new_renderImageUploadArray)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
