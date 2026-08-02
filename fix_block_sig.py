import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

target = r"\}\n\n\n  const handleChange = \(key: string, value: any\) => \{"
replacement = r"""}

export default function BlockFormEditor({ block, onChange, pagesList }: BlockFormEditorProps) {
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{ isOpen: boolean; onSelect: (url: string) => void }>({ isOpen: false, onSelect: () => {} });
  if (!block) return <div className="text-sm text-slate-500 text-center py-8">Lütfen düzenlemek için bir modül seçin.</div>;

  const handleChange = (key: string, value: any) => {"""

content = re.sub(target, replacement, content)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
