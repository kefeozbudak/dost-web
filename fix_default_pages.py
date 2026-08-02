import os

files_to_update = {
    'src/admin/AdminLayout.tsx': "          { id: 'duyurular', title: 'Duyurular', status: 'published', path: '/duyurular' },",
    'src/admin/AdminDashboard.tsx': "          { id: 'duyurular', title: 'Duyurular', views: 0, lastEdited: new Date().toISOString().split('T')[0], status: 'published', path: '/duyurular' },",
    'src/admin/hubs/PagesCenter.tsx': "        { id: 'duyurular', title: 'Duyurular', status: 'published', lastEdited: new Date().toISOString().split('T')[0], path: '/duyurular', isDefault: true },",
    'src/admin/PageEditor.tsx': "        { id: 'duyurular', title: 'Duyurular', path: '/duyurular' },"
}

for filepath, line_to_add in files_to_update.items():
    with open(filepath, 'r') as f:
        content = f.read()
    
    if 'id: \'duyurular\'' not in content:
        # Find the end of defaultPages array
        # This is a bit tricky, let's find "const defaultPages = ["
        idx = content.find("const defaultPages = [")
        if idx != -1:
            # find the next '{'
            idx_start = content.find("{", idx)
            if idx_start != -1:
                # insert before the first item, inside the array
                content = content[:idx_start] + line_to_add + "\n" + content[idx_start:]
                with open(filepath, 'w') as f:
                    f.write(content)
                print(f"Added to {filepath}")
    else:
        print(f"Already in {filepath}")
