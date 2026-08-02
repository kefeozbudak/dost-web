import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

target = r"""<div className="flex gap-2">
                  <input
                    type="text"
                    value=\{item\.image \|\| ''\}
                    onChange=\{\(e\) => handleArrayChange\('items', i, 'image', e\.target\.value\)\}
                    placeholder="Görsel URL"
                    className="flex-1 px-2 py-1 text-xs font-mono border border-slate-300 rounded"
                  />
                  <input
                    type="file"
                    accept="image/\*"
                    onChange=\{\(e\) => \{
                      if \(e\.target\.files\?\.\[0\]\) \{
                        const reader = new FileReader\(\);
                        reader\.onloadend = \(\) => handleArrayChange\('items', i, 'image', reader\.result\);
                        reader\.readAsDataURL\(e\.target\.files\[0\]\);
                      \}
                    \}\}
                    className="w-24 text-\[10px\]"
                  />
                </div>"""

replacement = """{renderImageUploadArray('Kampüs Görseli', 'items', i, 'image')}"""

content = re.sub(target, replacement, content)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
