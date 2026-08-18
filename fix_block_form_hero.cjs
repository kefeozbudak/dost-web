const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const missingCode = `            {renderArrayEditor(
              "images",
              [
                { key: "url", label: "Resim Yükle", type: "image" },
                { key: "caption", label: "Alt Bilgi (Caption)", type: "text" },
              ],
              "Hero Görselleri",
              false
            )}
            {renderArrayEditor(
              "buttons",
              [
                { key: "label", label: "Metin", type: "text" },
                { key: "url", label: "URL", type: "url" },
                { key: "icon", label: "İkon", type: "icon" },
                { key: "style", label: "Stil (solid/outline)", type: "text" },
              ],
              "Yönlendirme Butonları"
            )}
          </div>
        )}
        
        {block.type === "menu_hero" && (
          <div className="space-y-4">
            {renderHeroOverlaySetting()}
            {renderInputWithStyle("Badge (Etiket)", "badge")}
            {renderTextareaWithStyle("Başlık", "title")}
            {renderTextareaWithStyle("Açıklama", "subtitle")}
            {renderImageUpload("Arkaplan Resmi", "image")}
          </div>
        )}
        
        {block.type === "menu_calendar" && (
          <div className="space-y-4">
            {renderTextareaWithStyle("Başlık", "title")}
            {renderTextareaWithStyle("Açıklama", "subtitle")}
            {renderInputWithStyle("Ay (örn: Ekim 2023)", "month")}
            <CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} />
          </div>
        )}
`;

code = code.replace(
  /\{renderTextareaWithStyle\("Alt Başlık", "subtitle"\)\}<CalendarGridEditor block=\{block\} arrayKey="days" onChange=\{handleChange\} \/>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?\)\}/,
  `{renderTextareaWithStyle("Alt Başlık", "subtitle")}\n${missingCode}`
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
