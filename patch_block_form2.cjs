const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf-8');

const overlaySetting = `
  const renderHeroOverlaySetting = () => {
    if (!block.type?.includes('hero')) return null;
    return (
      <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg mb-4">
        <input
          type="checkbox"
          checked={block.styles?.enableDarkOverlay || false}
          onChange={(e) => handleStyleChange("enableDarkOverlay", e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
        />
        <label className="text-sm font-medium text-slate-700">
          Karanlık Katman Uygula (Karanlık filtre ekler, fareyle üzerine gelince orijinal resmi gösterir)
        </label>
      </div>
    );
  };
`;

if (!content.includes('renderHeroOverlaySetting')) {
  content = content.replace('const renderCommonFields = () => (', overlaySetting + '\n  const renderCommonFields = () => (\n    <div className="space-y-4">\n      {renderHeroOverlaySetting()}');
  // wait, the original was:
  // const renderCommonFields = () => (
  //   <div className="space-y-4">
  //     {renderTextareaWithStyle("Başlık", "title")}
  
  content = content.replace(
    '  const renderCommonFields = () => (\n    <div className="space-y-4">\n      {renderTextareaWithStyle',
    '  const renderCommonFields = () => (\n    <div className="space-y-4">\n      {renderHeroOverlaySetting()}\n      {renderTextareaWithStyle'
  );
  fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
  console.log("Patched renderCommonFields");
}
