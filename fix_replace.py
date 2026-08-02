import re

with open("src/admin/BlockFormEditor.tsx", "r") as f:
    content = f.read()

target = r"""          <button 
            onClick=\{\(\) => setMediaPickerConfig\(\{ isOpen: true, onSelect: \(url\) => handleArrayChange\(arrayKey, index, itemKey, url\) \}\)\}
            className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 rounded-md cursor-pointer transition-colors" """

replacement = r"""          <button 
            onClick={() => setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url) })}
            className="flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-3 rounded-md cursor-pointer transition-colors" """

content = re.sub(target, replacement, content, count=1)

with open("src/admin/BlockFormEditor.tsx", "w") as f:
    f.write(content)
