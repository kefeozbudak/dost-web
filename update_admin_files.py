import re

def insert_into_array(file_path, array_name, new_element_str, search_pattern=None):
    with open(file_path, 'r') as f:
        code = f.read()
    
    # We will just do a simple replacement based on regex or string matching
    if search_pattern:
        # Example: search_pattern = r"(const defaultPages = \[\s*)"
        code = re.sub(search_pattern, r"\1" + new_element_str + ",\n", code)
    
    with open(file_path, 'w') as f:
        f.write(code)

# 1. src/admin/AdminLayout.tsx
insert_into_array(
    'src/admin/AdminLayout.tsx', 
    'defaultPages', 
    "{ id: 'akademik-kadro', title: 'Akademik Kadro', status: 'published', path: '/akademik-kadro' }",
    r"(const defaultPages = \[\s*)"
)

# 2. src/admin/AdminDashboard.tsx
insert_into_array(
    'src/admin/AdminDashboard.tsx',
    'defaultPages',
    "{ id: 'akademik-kadro', title: 'Akademik Kadro', views: 0, lastEdited: new Date().toISOString().split('T')[0], status: 'published', path: '/akademik-kadro' }",
    r"(const defaultPages = \[\s*)"
)

# 3. src/admin/hubs/PagesCenter.tsx
insert_into_array(
    'src/admin/hubs/PagesCenter.tsx',
    'defaultPages',
    "{ id: 'akademik-kadro', title: 'Akademik Kadro', status: 'published', lastEdited: new Date().toISOString().split('T')[0], path: '/akademik-kadro', isDefault: true }",
    r"(const defaultPages = \[\s*)"
)

# 4. src/admin/hubs/AppearanceCenter.tsx
insert_into_array(
    'src/admin/hubs/AppearanceCenter.tsx',
    'defaultPages',
    "{ id: 'akademik-kadro', title: 'Akademik Kadro', path: '/akademik-kadro' }",
    r"(const defaultPages = \[\s*)"
)

# 5. src/admin/PageEditor.tsx
insert_into_array(
    'src/admin/PageEditor.tsx',
    'pagesList',
    "{ id: 'akademik-kadro', title: 'Akademik Kadro', path: '/akademik-kadro' }",
    r"(const pagesList = \[\s*)"
)

print("Updated admin files.")
