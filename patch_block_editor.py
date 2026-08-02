import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

# Add import
target_import = r"import \{ Trash2, Plus, GripVertical, Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, FileText \} from 'lucide-react';"
replacement_import = r"import { Trash2, Plus, GripVertical, Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, FileText } from 'lucide-react';\nimport MediaPickerModal from '../components/MediaPickerModal';"
content = re.sub(target_import, replacement_import, content)

# Add state
target_state = r"export default function BlockFormEditor\(\{ block, onChange, pagesList \}: BlockFormEditorProps\) \{\n  if \(\!block\) return <div className=\"text-sm text-slate-500 text-center py-8\">Lütfen düzenlemek için bir modül seçin\.<\/div>;\n"
replacement_state = r"""export default function BlockFormEditor({ block, onChange, pagesList }: BlockFormEditorProps) {
  const [mediaPickerConfig, setMediaPickerConfig] = useState<{ isOpen: boolean; onSelect: (url: string) => void }>({ isOpen: false, onSelect: () => {} });
  if (!block) return <div className="text-sm text-slate-500 text-center py-8">Lütfen düzenlemek için bir modül seçin.</div>;
"""
content = re.sub(target_state, replacement_state, content)

# Modify renderImageUpload
target_upload = r"""          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 rounded cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <ImageIcon className="w-3 h-3 text-slate-600" />
            <input type="file" accept="image/\*" onChange=\{handleFileChange\} className="hidden" />
          </label>"""
          
replacement_upload = r"""          <button 
            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url) })}
            className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-2 rounded cursor-pointer transition-colors" 
            title="Medya Kütüphanesinden Seç"
          >
            <ImageIcon className="w-3 h-3" />
          </button>
          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 rounded cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <Plus className="w-3 h-3 text-slate-600" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>"""
content = re.sub(target_upload, replacement_upload, content, count=1)

# Modify renderImageUploadArray
target_upload_array = r"""          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 rounded cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <ImageIcon className="w-3 h-3 text-slate-600" />
            <input type="file" accept="image/\*" onChange=\{handleFileChange\} className="hidden" />
          </label>"""
          
replacement_upload_array = r"""          <button 
            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleArrayChange(arrayKey, index, itemKey, url) })}
            className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-2 rounded cursor-pointer transition-colors" 
            title="Medya Kütüphanesinden Seç"
          >
            <ImageIcon className="w-3 h-3" />
          </button>
          <label className="flex items-center justify-center bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 rounded cursor-pointer transition-colors" title="Bilgisayardan Resim Yükle">
            <Plus className="w-3 h-3 text-slate-600" />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>"""
content = re.sub(target_upload_array, replacement_upload_array, content, count=1)

# Add Modal rendering
target_render = r"    <div className=\"space-y-6\">\n      \{renderSpecificEditor\(\)\}"
replacement_render = r"""    <div className="space-y-6">
      <MediaPickerModal 
        isOpen={mediaPickerConfig.isOpen} 
        onClose={() => setMediaPickerConfig(prev => ({ ...prev, isOpen: false }))} 
        onSelect={mediaPickerConfig.onSelect} 
      />
      {renderSpecificEditor()}"""
content = re.sub(target_render, replacement_render, content)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
