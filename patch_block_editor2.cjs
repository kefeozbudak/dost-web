const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf-8');

const regex = /const renderHeroOverlaySetting = \(\) => \{[\s\S]*?gerçek resmi gösterir.\s*<\/p>\s*<\/div>\s*\)\}\s*<\/div>\s*\);\s*\};/;

const newFunction = `const renderHeroOverlaySetting = () => {
    if (!block.type?.includes('hero')) return null;
    return (
      <div className="flex flex-col gap-2 p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={block.styles?.enableDarkOverlay || false}
            onChange={(e) => handleStyleChange("enableDarkOverlay", e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
          <span className="text-sm font-bold text-slate-700">
            Karanlık Katman Uygula (Görsellerin üzerine yarı saydam karanlık filtre ekler)
          </span>
        </label>
        {block.styles?.enableDarkOverlay && (
          <div className="mt-2 pl-6 space-y-4">
            
            <div>
              <label className="flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Karanlık Derecesi (Görünürlük)</span>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{block.styles?.overlayOpacity ?? 100}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={block.styles?.overlayOpacity ?? 100}
                onChange={(e) => handleStyleChange("overlayOpacity", parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1 font-medium">
                <span>Şeffaf (0%)</span>
                <span>Tamamen Kapalı (100%)</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
               <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Katman Rengi</label>
               <input
                 type="color"
                 value={block.styles?.overlayColor || "#000000"}
                 onChange={(e) => handleStyleChange("overlayColor", e.target.value)}
                 className="w-8 h-8 rounded cursor-pointer border border-slate-300 p-0"
               />
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={block.styles?.overlayHoverReveal !== false} // default true
                onChange={(e) => handleStyleChange("overlayHoverReveal", e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-slate-600">
                Üzerine gelince (Hover) katmanı gizle ve orijinal resmi göster
              </span>
            </label>
          </div>
        )}
      </div>
    );
  };`;

if (content.match(regex)) {
  content = content.replace(regex, newFunction);
  fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
  console.log("Patched slider 2");
} else {
  console.log("Could not find regex match in BlockFormEditor");
}
