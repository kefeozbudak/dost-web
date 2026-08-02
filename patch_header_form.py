import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

old_code = """    case 'header':
      return (
        <div className="space-y-4">
          {renderImageUpload('Logo URL', 'logoUrl')}"""

new_code = """    case 'header':
      return (
        <div className="space-y-4">
          {renderImageUpload('Logo URL', 'logoUrl')}
          <div className="bg-white p-2 rounded border border-slate-100 shadow-sm">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Logo Boyutu (Yükseklik px)</label>
             <input type="number" value={block.logoHeight || 48} onChange={e => handleChange('logoHeight', e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div className="bg-white p-3 rounded border border-slate-100 shadow-sm space-y-3">
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aksiyon Butonu (Sağ Üst)</label>
             <label className="flex items-center gap-2 text-sm text-slate-700 font-medium">
               <input type="checkbox" checked={block.ctaButton?.hidden !== true} onChange={e => handleChange('ctaButton', { ...block.ctaButton, hidden: !e.target.checked })} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
               Butonu Göster
             </label>
             <input type="text" value={block.ctaButton?.label || 'Ön Kayıt Formu'} onChange={e => handleChange('ctaButton', { ...block.ctaButton, label: e.target.value })} placeholder="Buton Metni" className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none" />
             {renderUrlEditor(block.ctaButton?.url || '#', (val) => handleChange('ctaButton', { ...block.ctaButton, url: val }))}
          </div>"""

content = content.replace(old_code, new_code)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
