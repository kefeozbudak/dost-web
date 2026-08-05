const fs = require('fs');

function replaceInFile(path, search, replace) {
    if (!fs.existsSync(path)) return;
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(path, content);
}

replaceInFile('./src/admin/BlockFormEditor.tsx', 
  /setMediaPickerConfig\(\{ isOpen: true, onSelect: \(url\) => handleChange\(key, url\) \}\)/g, 
  `setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleChange(key, url || '') })`
);

replaceInFile('./src/admin/BlockFormEditor.tsx', 
  /setMediaPickerConfig\(\{ isOpen: true, onSelect: \(url\) => handleArrayChange\(arrayKey, idx, field.key, url\) \}\)/g, 
  `setMediaPickerConfig({ isOpen: true, onSelect: (url) => handleArrayChange(arrayKey, idx, field.key, url || '') })`
);

replaceInFile('./src/admin/hubs/AppearanceCenter.tsx', 
  /catch \(\(\)\=\>\{\}\);/g, 
  `catch (err) { console.error("Error resolving media URL:", err); };`
);

replaceInFile('./src/admin/hubs/AppearanceCenter.tsx', 
  /catch \(e\) \{\n\s*console.error\(e\);\n\s*console.error\('Resim yüklenirken hata oluştu'\);\n\s*\}/g, 
  `catch (e) {
      console.error("Error uploading image to media:", e);
      alert("Görsel yüklenirken bir hata oluştu: " + ((e as any).message || "Bilinmeyen hata"));
    }`
);

replaceInFile('./src/admin/hubs/AppearanceCenter.tsx', 
  /catch \(e\) \{\n\s*setMessage/g, 
  `catch (e) {
      console.error("Error saving settings:", e);
      setMessage`
);

replaceInFile('./src/admin/hubs/PagesCenter.tsx',
  /const pageId = formattedPath.substring\(1\).replace\(\/\[\^a-zA-Z0-9-\]\/g, '-'\) \|\| 'home';/,
  `const pageId = formattedPath.substring(1).replace(/[^a-zA-Z0-9-]/g, '-') || 'home';
    if (!pageId) {
      console.error("Failed to generate page ID from path:", formattedPath);
      alert("Geçersiz yol formatı.");
      setCreating(false);
      return;
    }`
);

