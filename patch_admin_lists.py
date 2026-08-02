import re

# 1. PageEditor.tsx (Available Blocks list)
with open('src/admin/PageEditor.tsx', 'r') as f:
    code = f.read()

new_blocks = """{ type: 'akademik_kadro', label: 'Akademik Kadro' },
                          { type: 'management_hero', label: 'Yönetim Kadrosu Hero' },
                          { type: 'management_rector', label: 'Rektör Bölümü' },
                          { type: 'management_vice_rectors', label: 'Rektör Yardımcıları' },
                          { type: 'management_deans', label: 'Dekanlar' },"""
code = code.replace("{ type: 'akademik_kadro', label: 'Akademik Kadro' },", new_blocks)

# Also add yonetim-kadrosu data to PageEditor
yonetim_condition = """        } else if (pageId === 'yonetim-kadrosu') {
          import('../lib/defaultData').then((module) => {
            const defaultData = { title: 'Yönetim Kadrosu', path: '/yonetim-kadrosu', blocks: module.defaultYonetimKadrosuData };
            setPageData(defaultData);
          });
"""
code = code.replace("} else if (pageId === 'akademik-kadro') {", yonetim_condition + "} else if (pageId === 'akademik-kadro') {")

# Also add to pagesList
yonetim_page = "{ id: 'yonetim-kadrosu', title: 'Yönetim Kadrosu', path: '/yonetim-kadrosu' },\n          "
code = code.replace("const pagesList = [\n          ", "const pagesList = [\n          " + yonetim_page)

with open('src/admin/PageEditor.tsx', 'w') as f:
    f.write(code)


# 2. AdminLayout.tsx
with open('src/admin/AdminLayout.tsx', 'r') as f:
    code = f.read()
code = code.replace("const defaultPages = [\n  ", "const defaultPages = [\n  { id: 'yonetim-kadrosu', title: 'Yönetim Kadrosu', status: 'published', path: '/yonetim-kadrosu' },\n  ")
with open('src/admin/AdminLayout.tsx', 'w') as f:
    f.write(code)


# 3. AdminDashboard.tsx
with open('src/admin/AdminDashboard.tsx', 'r') as f:
    code = f.read()
code = code.replace("const defaultPages = [\n        ", "const defaultPages = [\n        { id: 'yonetim-kadrosu', title: 'Yönetim Kadrosu', views: 0, lastEdited: new Date().toISOString().split('T')[0], status: 'published', path: '/yonetim-kadrosu' },\n        ")
with open('src/admin/AdminDashboard.tsx', 'w') as f:
    f.write(code)


# 4. PagesCenter.tsx
with open('src/admin/hubs/PagesCenter.tsx', 'r') as f:
    code = f.read()
code = code.replace("const defaultPages = [\n          ", "const defaultPages = [\n          { id: 'yonetim-kadrosu', title: 'Yönetim Kadrosu', status: 'published', lastEdited: new Date().toISOString().split('T')[0], path: '/yonetim-kadrosu', isDefault: true },\n          ")
with open('src/admin/hubs/PagesCenter.tsx', 'w') as f:
    f.write(code)


# 5. AppearanceCenter.tsx
with open('src/admin/hubs/AppearanceCenter.tsx', 'r') as f:
    code = f.read()
code = code.replace("const defaultPages = [\n          ", "const defaultPages = [\n          { id: 'yonetim-kadrosu', title: 'Yönetim Kadrosu', path: '/yonetim-kadrosu' },\n          ")
with open('src/admin/hubs/AppearanceCenter.tsx', 'w') as f:
    f.write(code)


# 6. PublicView.tsx
with open('src/pages/PublicView.tsx', 'r') as f:
    code = f.read()

code = code.replace("defaultAkademikKadroData }", "defaultAkademikKadroData, defaultYonetimKadrosuData }")
yonetim_condition_pv = """      } else if (location.pathname === '/yonetim-kadrosu') {
        import('../lib/defaultData').then((module) => {
          setPageData({
            title: 'Yönetim Kadrosu',
            blocks: module.defaultYonetimKadrosuData
          });
        });
"""
code = code.replace("} else if (location.pathname === '/akademik-kadro') {", yonetim_condition_pv + "} else if (location.pathname === '/akademik-kadro') {")

with open('src/pages/PublicView.tsx', 'w') as f:
    f.write(code)

print("Updated all admin lists and routing logic for yonetim-kadrosu")
