const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const insertionTarget = `      {block.type === 'contact_hero' && (
        <div className="space-y-4">
          {renderCommonFields()}
        </div>
      )}`;

const newsBlocks = `      {block.type === 'contact_hero' && (
        <div className="space-y-4">
          {renderCommonFields()}
        </div>
      )}

      {block.type === 'news_hero' && (
        <div className="space-y-4">
          {renderHeroOverlaySetting()}
          {renderTextareaWithStyle("Başlık", "title")}
          {renderTextareaWithStyle("Alt Başlık", "subtitle")}
          {renderImageUpload("Arkaplan Görseli", "image")}
        </div>
      )}

      {block.type === 'news_grid' && (
        <div className="space-y-4">
          <div className="font-bold text-sm text-slate-700 mb-2">Haberler / Duyurular</div>
          {renderArrayEditor(
            "categories",
            [
              { key: "label", label: "Kategori Adı", type: "text" }
            ],
            "Kategoriler"
          )}
          {renderArrayEditor(
            "items",
            [
              { key: "image", label: "Haber Görseli", type: "image" },
              { key: "tag", label: "Kategori Etiketi", type: "text" },
              { key: "tagColor", label: "Etiket Renk Sınıfı (örn: bg-primary)", type: "text" },
              { key: "date", label: "Tarih", type: "text" },
              { key: "title", label: "Haber Başlığı", type: "text" },
              { key: "desc", label: "Haber Özeti", type: "textarea" },
              { key: "url", label: "Haber Linki", type: "url" },
              { key: "buttonText", label: "Buton Metni (örn: Devamını Oku)", type: "text" },
              { key: "hideButton", label: "Butonu Gizle", type: "checkbox" }
            ],
            "Haber İçerikleri"
          )}
        </div>
      )}

      {block.type === 'newsletter' && (
        <div className="space-y-4">
          {renderInputWithStyle("İkon (örn: mail)", "icon", "icon")}
          {renderTextareaWithStyle("Başlık", "title")}
          {renderTextareaWithStyle("Açıklama", "desc")}
          {renderInputWithStyle("Giriş Alanı Metni (Placeholder)", "placeholder")}
          {renderInputWithStyle("Buton Metni", "buttonText")}
          {renderTextareaWithStyle("Alt Bilgi (Disclaimer)", "disclaimer")}
        </div>
      )}`;

code = code.replace(insertionTarget, newsBlocks);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
