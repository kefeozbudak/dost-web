import re

with open('src/admin/PageEditor.tsx', 'r') as f:
    code = f.read()

# Remove the broken part from the previous attempt if any
code = re.sub(r" else if \(pageId === 'duyurular'\) \{\n\s+initialData = defaultDuyurularData;\n\s+\}", "", code)

if "pageId === 'duyurular'" not in code:
    insertion = """} else if (pageId === 'duyurular') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Duyurular', path: '/duyurular', blocks: module.defaultDuyurularData };
            setPageData(defaultData);
          });
"""
    code = code.replace("} else if (pageId === 'basarilarimiz') {", insertion + "} else if (pageId === 'basarilarimiz') {")
    with open('src/admin/PageEditor.tsx', 'w') as f:
        f.write(code)
    print("Fixed PageEditor.tsx")
