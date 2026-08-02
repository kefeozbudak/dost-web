import re

with open('src/components/MediaPickerModal.tsx', 'r') as f:
    code = f.read()

# Replace getDocs with getDocs, onSnapshot in imports if needed
if 'onSnapshot' not in code:
    code = code.replace('getDocs', 'getDocs, onSnapshot')

# Remove the refetch logic inside handleFileUpload
refetch_regex = re.compile(r"const q = query\(collection\(db, 'media'\), orderBy\('createdAt', 'desc'\), limit\(30\)\);\s*const snapshot = await getDocs\(q\);\s*const items = snapshot\.docs\.map\(doc => \(\{\s*id: doc\.id,\s*\.\.\.doc\.data\(\),\s*serveUrl: `/api/media/\$\{doc\.id\}`\s*\}\)\);\s*setMediaItems\(items\);")
code = refetch_regex.sub('', code)

# Fix the button type in BlockFormEditor so clicking it doesn't submit forms!
with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    editor_code = f.read()

# Add type="button" to all buttons that just have onClick={() => setMediaPickerConfig...}
editor_code = editor_code.replace('<button onClick={() => setMediaPickerConfig', '<button type="button" onClick={() => setMediaPickerConfig')

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(editor_code)

with open('src/components/MediaPickerModal.tsx', 'w') as f:
    f.write(code)

print("Fixed MediaPickerModal and BlockFormEditor!")
