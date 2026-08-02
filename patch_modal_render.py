import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

target_render = r"  return \(\n    <div className=\"space-y-4\">\n      \{renderContentEditor\(\)\}"
replacement_render = r"""  return (
    <div className="space-y-4">
      <MediaPickerModal 
        isOpen={mediaPickerConfig.isOpen} 
        onClose={() => setMediaPickerConfig(prev => ({ ...prev, isOpen: false }))} 
        onSelect={mediaPickerConfig.onSelect} 
      />
      {renderContentEditor()}"""
content = re.sub(target_render, replacement_render, content)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
