import os

files_to_update = [
    'src/admin/AdminLayout.tsx',
    'src/admin/AdminDashboard.tsx',
    'src/admin/hubs/AppearanceCenter.tsx',
    'src/admin/PageEditor.tsx'
]

for file in files_to_update:
    with open(file, 'r') as f:
        code = f.read()
    
    if "setPagesList(fetched)" in code:
        code = code.replace("setPagesList(fetched)", "setPagesList(fetched.filter((p: any) => !p.isDeleted))")
    
    if "fetchedPages.push(dp as any)" in code:
        code = code.replace(
            "fetchedPages.push(dp as any);\n          }\n        });\n        setDashboardData", 
            "fetchedPages.push(dp as any);\n          }\n        });\n        setDashboardData(prev => ({...prev, pages: fetchedPages.filter((p: any) => !p.isDeleted).slice(0, 5)})); return; // skip default set"
        )
    if file == 'src/admin/AdminDashboard.tsx':
        code = code.replace("setDashboardData(prev => ({ ...prev, pages: fetchedPages.slice(0, 5) }));", "setDashboardData(prev => ({ ...prev, pages: fetchedPages.filter((p: any) => !p.isDeleted).slice(0, 5) }));")
        
    if file == 'src/admin/hubs/AppearanceCenter.tsx' or file == 'src/admin/PageEditor.tsx':
        if "setPagesList(fetchedPages)" in code:
            code = code.replace("setPagesList(fetchedPages)", "setPagesList(fetchedPages.filter((p: any) => !p.isDeleted))")
            
    with open(file, 'w') as f:
        f.write(code)
    print(f"Updated {file}")
