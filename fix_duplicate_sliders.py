import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

target = r"""\{renderImageUploadArray\('Kampüs Görseli', 'items', i, 'image'\)\}
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-\[10px\] font-bold text-slate-400 uppercase tracking-wider mb-1">Konum X \(%\)</label>
                    <input type="range" min="0" max="100" value=\{item\.image_posX \?\? 50\} onChange=\{e => handleArrayChange\('items', i, 'image_posX', e\.target\.value\)\} className="w-full accent-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-\[10px\] font-bold text-slate-400 uppercase tracking-wider mb-1">Konum Y \(%\)</label>
                    <input type="range" min="0" max="100" value=\{item\.image_posY \?\? 50\} onChange=\{e => handleArrayChange\('items', i, 'image_posY', e\.target\.value\)\} className="w-full accent-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-\[10px\] font-bold text-slate-400 uppercase tracking-wider mb-1">Yakınlaştırma</label>
                    <input type="range" min="10" max="300" value=\{item\.image_scale \?\? 100\} onChange=\{e => handleArrayChange\('items', i, 'image_scale', e\.target\.value\)\} className="w-full accent-blue-500" />
                  </div>
                </div>"""

replacement = """{renderImageUploadArray('Kampüs Görseli', 'items', i, 'image')}"""

content = re.sub(target, replacement, content)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
