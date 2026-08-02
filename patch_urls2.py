import re

with open("src/admin/hubs/AppearanceCenter.tsx", "r") as f:
    content = f.read()

target1 = r'<input type="text" value=\{link\.url \|\| \'\'\} onChange=\{\(e\) => \{\s*const newCols = \[\.\.\.\(footerData\.columns \|\| \[\]\)\];\s*newCols\[0\]\.links\[idx\]\.url = e\.target\.value;\s*setFooterData\(\{\.\.\.footerData, columns: newCols\}\);\s*\}\} placeholder="URL" className="flex-1 px-3 py-2 border rounded-lg text-sm" />'
replace1 = r'{renderUrlEditor(link.url || "", (val) => { const newCols = [...(footerData.columns || [])]; newCols[0].links[idx].url = val; setFooterData({...footerData, columns: newCols}); })}'
content = re.sub(target1, replace1, content)

target2 = r'<input type="text" value=\{link\.url \|\| \'\'\} onChange=\{\(e\) => \{\s*const newLinks = \[\.\.\.\(footerData\.legalLinks \|\| \[\]\)\];\s*newLinks\[idx\]\.url = e\.target\.value;\s*setFooterData\(\{\.\.\.footerData, legalLinks: newLinks\}\);\s*\}\} placeholder="URL" className="flex-1 px-3 py-2 border rounded-lg text-sm" />'
replace2 = r'{renderUrlEditor(link.url || "", (val) => { const newLinks = [...(footerData.legalLinks || [])]; newLinks[idx].url = val; setFooterData({...footerData, legalLinks: newLinks}); })}'
content = re.sub(target2, replace2, content)

with open("src/admin/hubs/AppearanceCenter.tsx", "w") as f:
    f.write(content)

