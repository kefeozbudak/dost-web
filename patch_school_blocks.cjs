const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolBlocks.tsx', 'utf8');

// Patch SchoolHeroBlock
const schoolHeroOld = `<div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div className="bg-[#faf8ff]/90 backdrop-blur-sm p-4 rounded-lg border border-[#e2e8f0]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#006a62] text-[32px]">extension</span>
                <div>
                  <p className="text-sm text-[#1a1b23] font-bold">Oyun Temelli Eğitim</p>
                  <p className="text-[10px] font-bold text-[#64748b] tracking-widest uppercase">Aktif Öğrenme Yaklaşımı</p>
                </div>
              </div>
            </div>
          </div>`;

const overlayCardTemplate = `          {(block.overlayCard?.enabled ?? (block.type !== "high_school_hero")) && (
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="backdrop-blur-sm p-4 rounded-lg border" style={{ backgroundColor: block.overlayCard?.bgColor || "rgba(250, 248, 255, 0.9)", borderColor: block.overlayCard?.borderColor || "#e2e8f0" }}>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[32px]" style={{ color: block.overlayCard?.iconColor || "#006a62" }}>{block.overlayCard?.icon || "extension"}</span>
                  <div>
                    <p className="text-sm font-bold" style={{ color: block.overlayCard?.titleColor || "#1a1b23" }}>{block.overlayCard?.title || "Oyun Temelli Eğitim"}</p>
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: block.overlayCard?.subtitleColor || "#64748b" }}>{block.overlayCard?.subtitle || "Aktif Öğrenme Yaklaşımı"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}`;

content = content.replace(schoolHeroOld, overlayCardTemplate);

fs.writeFileSync('src/components/SchoolBlocks.tsx', content);
console.log("Patched SchoolBlocks");
