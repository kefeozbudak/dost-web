const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const badgeFields = `            {renderImageUpload("Görsel (Sağ Kısım)", "image")}
            {renderInputWithStyle(
              "Görsel Alt Rozet (Örn: Oyun Temelli Eğitim)",
              "imageBadgeTitle",
            )}
            {renderInputWithStyle(
              "Görsel Alt Açıklama (Örn: Aktif Öğrenme)",
              "imageBadgeDesc",
            )}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Görsel Alt İkon
              </label>
              <IconField
                value={block.imageBadgeIcon || ""}
                onChange={(val) => handleChange("imageBadgeIcon", val)}
              />
            </div>`;

code = code.replace(
  /\{renderImageUpload\("Görsel \(Arkaplan\)", "image"\)\}/g,
  badgeFields
);

// High school hero already has Görsel (Sağ Kısım) but no badge fields
const highSchoolFields = `            {renderImageUpload("Görsel (Sağ Kısım)", "image")}
            {renderInputWithStyle(
              "Görsel Alt Rozet (Örn: Oyun Temelli Eğitim)",
              "imageBadgeTitle",
            )}
            {renderInputWithStyle(
              "Görsel Alt Açıklama (Örn: Aktif Öğrenme)",
              "imageBadgeDesc",
            )}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Görsel Alt İkon
              </label>
              <IconField
                value={block.imageBadgeIcon || ""}
                onChange={(val) => handleChange("imageBadgeIcon", val)}
              />
            </div>`;
// Replace the exact line in high_school_hero
code = code.replace(
  /\{block\.type === "high_school_hero" && \([\s\S]*?\{renderImageUpload\("Görsel \(Sağ Kısım\)", "image"\)\}/,
  (match) => {
    return match.replace(
      `{renderImageUpload("Görsel (Sağ Kısım)", "image")}`,
      highSchoolFields
    );
  }
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
console.log("Updated editor fields");
