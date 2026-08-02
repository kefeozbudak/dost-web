import re

with open('src/pages/PublicView.tsx', 'r') as f:
    code = f.read()

# Make sure we add condition for akademik-kadro properly
akademik_condition = """      } else if (location.pathname === '/akademik-kadro') {
        import('../lib/defaultData').then((module) => {
          setPageData({
            title: 'Akademik Kadro',
            blocks: module.defaultAkademikKadroData
          });
        });
"""

# Replace the part correctly
code = code.replace("} else if (location.pathname === '/hakkimizda') {", akademik_condition + "} else if (location.pathname === '/hakkimizda') {")

with open('src/pages/PublicView.tsx', 'w') as f:
    f.write(code)

print("Patched PublicView.tsx with dynamic import logic")
