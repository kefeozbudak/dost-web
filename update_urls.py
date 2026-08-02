import re

with open("src/admin/hubs/AppearanceCenter.tsx", "r") as f:
    content = f.read()

# 1. ctaButton URL
target_cta = r'<input type="text" value=\{headerData\.ctaButton\?\.url \|\| \'\'\} onChange=\{\(e\) => setHeaderData\(\{\.\.\.headerData, ctaButton: \{\.\.\.headerData\.ctaButton, url: e\.target\.value\}\}\)\} className="w-full px-3 py-2 border rounded-lg text-sm" />'
replace_cta = r'{renderUrlEditor(headerData.ctaButton?.url || "", (val) => setHeaderData({...headerData, ctaButton: {...headerData.ctaButton, url: val}}))}'
content = re.sub(target_cta, replace_cta, content)

# 2. Main menu link URL
target_main = r'<input type="text" value=\{link\.url \|\| \'\'\} onChange=\{\(e\) => handleHeaderLinkChange\(index, \'url\', e\.target\.value\)\} placeholder="Bağlantı \(örn: /hakkimizda\)" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono text-blue-600" />'
replace_main = r'{renderUrlEditor(link.url || "", (val) => handleHeaderLinkChange(index, "url", val))}'
content = re.sub(target_main, replace_main, content)

# 3. Mega menu column link URL
target_mega_col = r'<input type="text" value=\{clink\.url \|\| \'\'\} onChange=\{\(e\) => \{\s*const newLinks = \[\.\.\.\(headerData\.links \|\| \[\]\)\];\s*newLinks\[index\]\.megaMenu\.columns\[colIdx\]\.links\[clinkIdx\]\.url = e\.target\.value;\s*setHeaderData\(\{ \.\.\.headerData, links: newLinks \}\);\s*\}\} placeholder="URL" className="w-full px-2 py-1 mb-1 text-xs border rounded" />'
replace_mega_col = r'{renderUrlEditor(clink.url || "", (val) => { const newLinks = [...(headerData.links || [])]; newLinks[index].megaMenu.columns[colIdx].links[clinkIdx].url = val; setHeaderData({ ...headerData, links: newLinks }); })}'
content = re.sub(target_mega_col, replace_mega_col, content)

# 4. Mega menu featured URL
target_mega_feat = r'<input type="text" value=\{link\.megaMenu\.featured\.url \|\| \'\'\} onChange=\{\(e\) => \{\s*const newLinks = \[\.\.\.\(headerData\.links \|\| \[\]\)\];\s*newLinks\[index\]\.megaMenu\.featured\.url = e\.target\.value;\s*setHeaderData\(\{ \.\.\.headerData, links: newLinks \}\);\s*\}\} placeholder="Buton Linki" className="px-3 py-2 text-sm border rounded" />'
replace_mega_feat = r'{renderUrlEditor(link.megaMenu.featured.url || "", (val) => { const newLinks = [...(headerData.links || [])]; newLinks[index].megaMenu.featured.url = val; setHeaderData({ ...headerData, links: newLinks }); })}'
content = re.sub(target_mega_feat, replace_mega_feat, content)

# 5. Footer column URL
target_footer_col = r'<input type="text" value=\{link\.url \|\| \'\'\} onChange=\{\(e\) => \{\s*const newCols = \[\.\.\.\(footerData\.columns \|\| \[\]\)\];\s*newCols\[0\]\.links\[idx\]\.url = e\.target\.value;\s*setFooterData\(\{\.\.\.footerData, columns: newCols\}\);\s*\}\} placeholder="Link" className="flex-1 px-3 py-2 border rounded-lg text-sm" />'
replace_footer_col = r'{renderUrlEditor(link.url || "", (val) => { const newCols = [...(footerData.columns || [])]; newCols[0].links[idx].url = val; setFooterData({...footerData, columns: newCols}); })}'
content = re.sub(target_footer_col, replace_footer_col, content)

# 6. Footer legal URL
target_footer_leg = r'<input type="text" value=\{link\.url \|\| \'\'\} onChange=\{\(e\) => \{\s*const newLinks = \[\.\.\.\(footerData\.legalLinks \|\| \[\]\)\];\s*newLinks\[idx\]\.url = e\.target\.value;\s*setFooterData\(\{\.\.\.footerData, legalLinks: newLinks\}\);\s*\}\} placeholder="Link" className="flex-1 px-3 py-2 border rounded-lg text-sm" />'
replace_footer_leg = r'{renderUrlEditor(link.url || "", (val) => { const newLinks = [...(footerData.legalLinks || [])]; newLinks[idx].url = val; setFooterData({...footerData, legalLinks: newLinks}); })}'
content = re.sub(target_footer_leg, replace_footer_leg, content)

with open("src/admin/hubs/AppearanceCenter.tsx", "w") as f:
    f.write(content)

print("Done")
