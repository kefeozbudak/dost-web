import re

def patch_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()
    
    # 1. Update compressImage defaults
    content = re.sub(r'maxWidth = \d+, maxHeight = \d+, quality = [\d\.]+', 'maxWidth = 800, maxHeight = 800, quality = 0.5', content)
    
    # 2. Add limit import
    if "limit" not in content and "firebase/firestore" in content:
        content = content.replace("orderBy, ", "orderBy, limit, ")
        content = content.replace("orderBy }", "orderBy, limit }")
        
    # 3. Add limit(30) to queries
    content = content.replace("orderBy('createdAt', 'desc')", "orderBy('createdAt', 'desc'), limit(30)")
    
    with open(filepath, "w") as f:
        f.write(content)

patch_file("src/components/MediaPickerModal.tsx")
patch_file("src/admin/hubs/MediaCenter.tsx")
