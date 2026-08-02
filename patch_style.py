import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

old_code = """          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Öğe Başlık Rengi</label>"""

new_code = """          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Öğe Başlık BG Rengi</label>
              <div className="flex gap-2 items-center bg-white p-1 rounded border border-slate-200 mb-2">
                <input type="color" value={styles.itemTitleBgColor || '#ffffff'} onChange={e => handleStyleChange('itemTitleBgColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer p-0 border-0 bg-transparent" />
                <span className="text-xs text-slate-500 font-mono">{styles.itemTitleBgColor || 'Varsayılan'}</span>
                {styles.itemTitleBgColor && (
                  <button onClick={() => handleStyleChange('itemTitleBgColor', '')} className="ml-auto text-slate-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                )}
              </div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Öğe Başlık Rengi</label>"""

content = content.replace(old_code, new_code)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
