import re

with open('src/pages/PublicView.tsx', 'r') as f:
    code = f.read()

# Make sure to import defaultAkademikKadroData
code = code.replace("defaultHomePageData, defaultHakkimizdaData", "defaultHomePageData, defaultHakkimizdaData, defaultAkademikKadroData")
if "defaultAkademikKadroData" not in code.split('\n')[0] and "defaultAkademikKadroData" not in code.split('\n')[1] and "defaultAkademikKadroData" not in code.split('\n')[2]:
   # Just in case import was different
   code = code.replace("{ defaultHomePageData, defaultHakkimizdaData }", "{ defaultHomePageData, defaultHakkimizdaData, defaultAkademikKadroData }")

# Add the condition for /akademik-kadro
if "if (location.pathname === '/akademik-kadro') defaultData = defaultAkademikKadroData;" not in code:
    code = code.replace("if (location.pathname === '/hakkimizda') defaultData = defaultHakkimizdaData;", "if (location.pathname === '/hakkimizda') defaultData = defaultHakkimizdaData;\n        if (location.pathname === '/akademik-kadro') defaultData = defaultAkademikKadroData;")

with open('src/pages/PublicView.tsx', 'w') as f:
    f.write(code)

print("Updated PublicView.tsx")
