const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const anchor = `{block.type === "tuition_fees_hero" && (`

const addition = `
      {block.type === "bursluluk_hero" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderInputWithStyle("Rozet (Badge)", "badge")}
          {renderImageUpload("Arka Plan Görseli", "image")}
          {renderArrayEditor("stats", [
            { key: "value", label: "Değer (Örn: 16-17 Mart)", type: "text" },
            { key: "label", label: "Etiket (Örn: Sınav Tarihi)", type: "text" }
          ], "İstatistikler")}
        </div>
      )}

      {block.type === "bursluluk_exam_form" && (
        <div className="space-y-4">
          {renderCommonFields()}
        </div>
      )}

      {block.type === "bursluluk_info_cards" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderArrayEditor("items", [
            { key: "title", label: "Kart Başlığı", type: "text" },
            { key: "icon", label: "İkon (Material)", type: "icon" },
            { key: "rules", label: "Kurallar/Maddeler (Satır başı yaparak giriniz)", type: "textarea" }
          ], "Bilgi Kartları")}
        </div>
      )}

      {block.type === "bursluluk_result_query" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderInputWithStyle("Buton Metni", "buttonText")}
          {renderImageUpload("Görsel", "image")}
        </div>
      )}

      {block.type === "career_hero" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderImageUpload("Arka Plan Görseli", "image")}
        </div>
      )}

      {block.type === "career_benefits" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderArrayEditor("items", [
            { key: "title", label: "Başlık", type: "text" },
            { key: "desc", label: "Açıklama", type: "textarea" },
            { key: "icon", label: "İkon (Material)", type: "icon" }
          ], "Avantajlar / Haklar")}
        </div>
      )}

      {block.type === "career_application" && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderArrayEditor("items", [
            { key: "title", label: "Pozisyon Başlığı", type: "text" },
            { key: "type", label: "Çalışma Tipi (Örn: Tam Zamanlı)", type: "text" },
            { key: "dept", label: "Departman (Örn: İlkokul)", type: "text" }
          ], "Açık Pozisyonlar")}
        </div>
      )}
`;

if (code.includes(anchor)) {
    code = code.replace(anchor, addition + "\\n      " + anchor);
    fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
    console.log("Patched BlockFormEditor successfully");
} else {
    console.log("Anchor not found!");
}
