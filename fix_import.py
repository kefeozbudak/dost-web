import re
with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

content = content.replace("import MediaPickerModal from '../components/MediaPickerModal';\nimport MediaPickerModal from '../components/MediaPickerModal';", "import MediaPickerModal from '../components/MediaPickerModal';")

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
