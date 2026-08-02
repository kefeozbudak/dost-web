import re

def insert_into_default_pages(file_path):
    with open(file_path, 'r') as f:
        code = f.read()
    
    # We look for something like: { id: 'basarilarimiz', title: 'Başarılarımız', path: '/basarilarimiz' }
    if "'duyurular'" not in code:
        code = re.sub(
            r"({ id: 'basarilarimiz', title: 'Başarılarımız', path: '/basarilarimiz' })",
            r"\1,\n      { id: 'duyurular', title: 'Duyurular', path: '/duyurular' }",
            code
        )
        with open(file_path, 'w') as f:
            f.write(code)
        print(f"Updated {file_path}")

files_to_update = [
    'src/admin/AdminLayout.tsx',
    'src/admin/AdminDashboard.tsx',
    'src/admin/hubs/PagesCenter.tsx',
    'src/admin/hubs/AppearanceCenter.tsx'
]

for file_path in files_to_update:
    insert_into_default_pages(file_path)

# Special for PageEditor.tsx
with open('src/admin/PageEditor.tsx', 'r') as f:
    code = f.read()

if "'duyurular'" not in code:
    code = re.sub(
        r"({ id: 'basarilarimiz', title: 'Başarılarımız', path: '/basarilarimiz' })",
        r"\1,\n    { id: 'duyurular', title: 'Duyurular', path: '/duyurular' }",
        code
    )
    # also add it to defaultData import if needed, but PageEditor handles that directly or checks it.
    code = re.sub(
        r"import {.*defaultBasarilarimizData.*} from '../lib/defaultData';",
        r"import { defaultHomePageData, defaultHakkimizdaData, defaultAkademikKadroData, defaultYonetimKadrosuData, defaultBasarilarimizData, defaultDuyurularData } from '../lib/defaultData';",
        code
    )
    
    code = re.sub(
        r"(if \(pageId === 'basarilarimiz'\) \{\n\s+initialData = defaultBasarilarimizData;\n\s+\})",
        r"\1 else if (pageId === 'duyurular') {\n        initialData = defaultDuyurularData;\n      }",
        code
    )
    with open('src/admin/PageEditor.tsx', 'w') as f:
        f.write(code)
    print("Updated PageEditor.tsx")

# Special for PublicView.tsx
with open('src/pages/PublicView.tsx', 'r') as f:
    code = f.read()

if "'/duyurular'" not in code:
    code = re.sub(
        r"import {.*defaultBasarilarimizData.*} from '../lib/defaultData';",
        r"import { defaultHomePageData, defaultHakkimizdaData, defaultAkademikKadroData, defaultYonetimKadrosuData, defaultBasarilarimizData, defaultDuyurularData } from '../lib/defaultData';",
        code
    )
    
    code = re.sub(
        r"(if \(location.pathname === '/basarilarimiz'\) \{\n\s+pageId = 'basarilarimiz';\n\s+defaultDataToUse = defaultBasarilarimizData;\n\s+\})",
        r"\1 else if (location.pathname === '/duyurular') {\n        pageId = 'duyurular';\n        defaultDataToUse = defaultDuyurularData;\n      }",
        code
    )
    with open('src/pages/PublicView.tsx', 'w') as f:
        f.write(code)
    print("Updated PublicView.tsx")

