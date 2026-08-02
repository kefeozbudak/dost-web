import re

with open('src/admin/PageEditor.tsx', 'r') as f:
    code = f.read()

# Add condition for akademik-kadro
akademik_condition = """        } else if (pageId === 'akademik-kadro') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Akademik Kadro', path: '/akademik-kadro', blocks: module.defaultAkademikKadroData };
            setPageData(defaultData);
          });
"""

code = code.replace("} else if (pageId === 'hakkimizda') {", akademik_condition + "} else if (pageId === 'hakkimizda') {")

with open('src/admin/PageEditor.tsx', 'w') as f:
    f.write(code)

print("Patched PageEditor.tsx default data logic")
