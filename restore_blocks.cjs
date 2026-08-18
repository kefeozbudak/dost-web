const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const target = `            )}
          </div>
        )}
      </div>`;

const blocksToInsert = `            )}
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
            <CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} activeArrayItem={activeArrayItem} />
          </div>
        )}

        {block.type === "academic_calendar_hero" && (
          <div className="space-y-4">
            {renderTextareaWithStyle("Başlık", "title")}
            {renderTextareaWithStyle("Açıklama", "subtitle")}
            {renderImageUpload("Arkaplan Resmi", "image")}
          </div>
        )}

        {block.type === "academic_calendar" && (
          <div className="space-y-4">
            {renderTextareaWithStyle("Ay/Başlık", "month")}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-700">PDF Buton Ayarları</span>
            </div>
            {renderInputWithStyle("PDF Butonunu Gizle", "hidePdfButton", "checkbox")}
            {!block.hidePdfButton && (
              <>
                {renderInputWithStyle("PDF URL", "pdfUrl")}
                {renderInputWithStyle("PDF Buton Metni", "pdfButtonText")}
              </>
            )}
            <CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} activeArrayItem={activeArrayItem} />
          </div>
        )}
      </div>`;

code = code.replace(target, blocksToInsert);

// Now fix the calendar grid editor in menu_features which shouldn't be there.
// We need to remove `<CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} />` from inside `menu_features`.
code = code.replace(
  /{block.type === "menu_features" && \(\s*<div className="space-y-4">\s*<CalendarGridEditor block=\{block\} arrayKey="days" onChange=\{handleChange\} \/>/,
  `{block.type === "menu_features" && (
          <div className="space-y-4">`
);

// We need to remove `<CalendarGridEditor block={block} arrayKey="days" onChange={handleChange} />` from inside `hero` block!
code = code.replace(
  /{renderTextareaWithStyle\("Alt Başlık", "subtitle"\)}<CalendarGridEditor block=\{block\} arrayKey="days" onChange=\{handleChange\} \/>/,
  `{renderTextareaWithStyle("Alt Başlık", "subtitle")}`
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
