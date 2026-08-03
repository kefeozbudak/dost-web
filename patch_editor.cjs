const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const inputsEditor = `
            {renderArrayEditor('inputs', [
              { key: 'type', label: 'Tipi', type: 'select', options: [{value: 'text', label: 'Kısa Metin (Text)'}, {value: 'email', label: 'E-posta'}, {value: 'tel', label: 'Telefon'}, {value: 'select', label: 'Açılır Liste (Select)'}, {value: 'textarea', label: 'Uzun Metin'}, {value: 'radio', label: 'Çoktan Seçmeli (Radio)'}, {value: 'checkbox', label: 'Onay Kutusu (Checkbox)'}, {value: 'section_title', label: 'Bölüm Başlığı'}] },
              { key: 'name', label: 'Alan Adı (İngilizce/Boşluksuz)', type: 'text' },
              { key: 'label', label: 'Görünen Etiket', type: 'text' },
              { key: 'placeholder', label: 'Yer Tutucu', type: 'text' },
              { key: 'options', label: 'Seçenekler (Virgülle ayırın, select/radio için)', type: 'text' },
              { key: 'required', label: 'Zorunlu', type: 'checkbox' },
              { key: 'icon', label: 'İkon (Bölüm başlığı için)', type: 'text' },
            ], "Form Alanları (İnputlar)")}
`;

const clubsEditor = `
            {renderArrayEditor('clubs', [
              { key: 'id', label: 'Kulüp ID (boşluksuz)', type: 'text' },
              { key: 'label', label: 'Kulüp Adı', type: 'text' },
              { key: 'icon', label: 'İkon (Google Material)', type: 'text' },
            ], "Kulüpler")}
`;

const oldClub = `{block.type === 'club_registration_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
          </div>
        )}`;

const newClub = `{block.type === 'club_registration_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Form Başlığı', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            ${clubsEditor}
            ${inputsEditor}
          </div>
        )}`;

code = code.replace(oldClub, newClub);

const oldPre = `{block.type === 'pre_registration_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Form Başlığı (Örn: ÖĞRENCİ ÖN KAYIT FORMU)', 'title')}
            {renderInputWithStyle('Alt Başlık (Örn: Lütfen Formu Eksiksiz Doldurunuz.)', 'subtitle')}
            {renderInputWithStyle('Webhook URL (Opsiyonel: Form gönderilince verilerin iletileceği URL)', 'webhookUrl')}
            <p className="text-xs text-slate-500 italic mt-1">Bu form önceden tanımlanmış sabit bir yapıya sahiptir. Renk ve stiller "İleri Düzey Stiller" sekmesinden veya blok stillerinden ayarlanabilir.</p>
          </div>
        )}`;

const newPre = `{block.type === 'pre_registration_form' && (
          <div className="space-y-4">
            {renderCommonFields()}
            {renderInputWithStyle('Form Başlığı (Örn: ÖĞRENCİ ÖN KAYIT FORMU)', 'title')}
            {renderInputWithStyle('Alt Başlık (Örn: Lütfen Formu Eksiksiz Doldurunuz.)', 'subtitle')}
            {renderInputWithStyle('Webhook URL (Opsiyonel: Form gönderilince verilerin iletileceği URL)', 'webhookUrl')}
            ${inputsEditor}
          </div>
        )}`;

code = code.replace(oldPre, newPre);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
console.log("Patched BlockFormEditor");
