import re

# 1. PageEditor.tsx (Available Blocks list)
with open('src/admin/PageEditor.tsx', 'r') as f:
    code = f.read()

new_blocks = """{ type: 'management_deans', label: 'Dekanlar' },
                          { type: 'achievements_hero', label: 'Başarılar Hero' },
                          { type: 'achievements_academic_bento', label: 'Başarılar Akademik Bento' },
                          { type: 'achievements_social_gallery', label: 'Başarılar Sosyal Galeri' },
                          { type: 'achievements_science_projects', label: 'Başarılar Bilim Projeleri' },"""
code = code.replace("{ type: 'management_deans', label: 'Dekanlar' },", new_blocks)

# Also add basarilarimiz data to PageEditor
basarilarimiz_condition = """        } else if (pageId === 'basarilarimiz') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Başarılarımız', path: '/basarilarimiz', blocks: module.defaultBasarilarimizData };
            setPageData(defaultData);
          });
"""
code = code.replace("} else if (pageId === 'yonetim-kadrosu') {", basarilarimiz_condition + "} else if (pageId === 'yonetim-kadrosu') {")

# Also add to pagesList
basarilarimiz_page = "{ id: 'basarilarimiz', title: 'Başarılarımız', path: '/basarilarimiz' },\n          "
code = code.replace("const pagesList = [\n          ", "const pagesList = [\n          " + basarilarimiz_page)

with open('src/admin/PageEditor.tsx', 'w') as f:
    f.write(code)


# 2. AdminLayout.tsx
with open('src/admin/AdminLayout.tsx', 'r') as f:
    code = f.read()
code = code.replace("const defaultPages = [\n  ", "const defaultPages = [\n  { id: 'basarilarimiz', title: 'Başarılarımız', status: 'published', path: '/basarilarimiz' },\n  ")
with open('src/admin/AdminLayout.tsx', 'w') as f:
    f.write(code)


# 3. AdminDashboard.tsx
with open('src/admin/AdminDashboard.tsx', 'r') as f:
    code = f.read()
code = code.replace("const defaultPages = [\n        ", "const defaultPages = [\n        { id: 'basarilarimiz', title: 'Başarılarımız', views: 0, lastEdited: new Date().toISOString().split('T')[0], status: 'published', path: '/basarilarimiz' },\n        ")
with open('src/admin/AdminDashboard.tsx', 'w') as f:
    f.write(code)


# 4. PagesCenter.tsx
with open('src/admin/hubs/PagesCenter.tsx', 'r') as f:
    code = f.read()
code = code.replace("const defaultPages = [\n          ", "const defaultPages = [\n          { id: 'basarilarimiz', title: 'Başarılarımız', status: 'published', lastEdited: new Date().toISOString().split('T')[0], path: '/basarilarimiz', isDefault: true },\n          ")
with open('src/admin/hubs/PagesCenter.tsx', 'w') as f:
    f.write(code)


# 5. AppearanceCenter.tsx
with open('src/admin/hubs/AppearanceCenter.tsx', 'r') as f:
    code = f.read()
code = code.replace("const defaultPages = [\n          ", "const defaultPages = [\n          { id: 'basarilarimiz', title: 'Başarılarımız', path: '/basarilarimiz' },\n          ")
with open('src/admin/hubs/AppearanceCenter.tsx', 'w') as f:
    f.write(code)


# 6. PublicView.tsx
with open('src/pages/PublicView.tsx', 'r') as f:
    code = f.read()

code = code.replace("defaultYonetimKadrosuData }", "defaultYonetimKadrosuData, defaultBasarilarimizData }")
basarilarimiz_condition_pv = """      } else if (location.pathname === '/basarilarimiz') {
        import('../lib/defaultData').then((module) => {
          setPageData({
            title: 'Başarılarımız',
            blocks: module.defaultBasarilarimizData
          });
        });
"""
code = code.replace("} else if (location.pathname === '/yonetim-kadrosu') {", basarilarimiz_condition_pv + "} else if (location.pathname === '/yonetim-kadrosu') {")

with open('src/pages/PublicView.tsx', 'w') as f:
    f.write(code)

print("Updated all admin lists and routing logic for basarilarimiz")
