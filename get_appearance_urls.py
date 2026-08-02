import re

with open("src/admin/hubs/AppearanceCenter.tsx", "r") as f:
    content = f.read()

urls = re.findall(r'<input type="text" value=\{[a-zA-Z0-9_.\?]+?url \|\| \'\'\} onChange=\{\(e\) => [a-zA-Z0-9_.\(,\'\s]+e\.target\.value.*?\} placeholder="Bağlantı[^"]*"', content)
for u in urls:
    print(u)
