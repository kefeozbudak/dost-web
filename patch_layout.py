import re

with open("src/admin/AdminLayout.tsx", "r") as f:
    content = f.read()

target_imports = r"  ShieldCheck\n\} from 'lucide-react';"
replacement_imports = r"  ShieldCheck,\n  Image as ImageIcon\n} from 'lucide-react';"
content = re.sub(target_imports, replacement_imports, content)

target_menu = r"\{ id: 'assistant', icon: Bot, label: 'Veli Asistanı', path: '/admin/assistant' \},"
replacement_menu = r"{ id: 'assistant', icon: Bot, label: 'Veli Asistanı', path: '/admin/assistant' },\n    { id: 'media', icon: ImageIcon, label: 'Medya Merkezi', path: '/admin/media' },"
content = re.sub(target_menu, replacement_menu, content)

with open("src/admin/AdminLayout.tsx", "w") as f:
    f.write(content)
