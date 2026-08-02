import re

with open("src/admin/hubs/AppearanceCenter.tsx", "r") as f:
    content = f.read()

# Fix Duplicate ImageIcon
content = content.replace("import { Image as ImageIcon } from 'lucide-react';\nimport { Save, Plus, Trash2, Layout, LayoutTemplate, Menu, Image as ImageIcon } from 'lucide-react';", "import { Save, Plus, Trash2, Layout, LayoutTemplate, Menu, Image as ImageIcon } from 'lucide-react';")

# Add missing state
target = r"export default function AppearanceCenter\(\) \{"
replacement = r"""export default function AppearanceCenter() {
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{ isOpen: boolean; onSelect: (url: string) => void }>({ isOpen: false, onSelect: () => {} });"""
content = re.sub(target, replacement, content)

with open("src/admin/hubs/AppearanceCenter.tsx", "w") as f:
    f.write(content)
