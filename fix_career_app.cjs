const fs = require('fs');
let file = fs.readFileSync('./src/admin/BlockFormEditor.tsx', 'utf8');

const oldCareerInputs = `            {renderArrayEditor('inputs', [
              { key: 'label', label: 'Label', type: 'text' },
              { key: 'name', label: 'Alan Adı (name)', type: 'text' },
              { key: 'type', label: 'Input Tipi', type: 'select', options: [
                  {value: 'text', label: 'Metin'},
                  {value: 'email', label: 'E-Posta'},
                  {value: 'tel', label: 'Telefon'},
                  {value: 'select', label: 'Seçim Kutusu'},
                  {value: 'checkbox', label: 'Onay Kutusu'}
              ]},
              { key: 'options', label: 'Seçenekler (select ise, virgülle)', type: 'text' }
            ], 'Ekstra Form Alanları')}`;

const newCareerInputs = `{renderArrayEditor('inputs', [
              { key: 'type', label: 'Veri Tipi (Giriş Türü)', type: 'select', options: [
                { value: 'text', label: 'Kısa Metin (Text)' },
                { value: 'select', label: 'Açılır Liste Seçimi (Select/Dropdown)' },
                { value: 'radio', label: 'Tekli Seçim (Radio)' },
                { value: 'checkbox', label: 'Onay Kutusu (Checkbox)' },
                { value: 'date', label: 'Tarih Seçici (Date)' },
                { value: 'tel', label: 'Telefon Numarası (Phone)' },
                { value: 'email', label: 'E-Posta Adresi (Email)' },
                { value: 'textarea', label: 'Uzun Metin Kutusu (Textarea)' },
                { value: 'file', label: 'Dosya Yükleme (Örn: CV)' },
                { value: 'section_title', label: 'Bölüm / Kısım Başlığı (Section Header)' }
              ] },
              { key: 'label', label: 'Görünen Etiket / Metin', type: 'text' },
              { key: 'name', label: 'Alan Kimliği / Key (İngilizce/Boşluksuz)', type: 'text' },
              { key: 'placeholder', label: 'Yer Tutucu Metin', type: 'text' },
              { key: 'options', label: 'Seçenekler (Açılır liste veya radio için virgülle ayırın)', type: 'textarea' },
              { key: 'required', label: 'Zorunlu Alan Mı?', type: 'checkbox' },
              { key: 'fullWidth', label: 'Tam Genişlik (2 Sütun Kaplasın Mı?)', type: 'checkbox' },
              { key: 'icon', label: 'İkon', type: 'icon' },
            ], "Form Alanları (İnputlar)")}`;

if(file.includes(oldCareerInputs)) {
  file = file.replace(oldCareerInputs, newCareerInputs);
} else {
  // alternative matching
  file = file.replace(/\{renderArrayEditor\('inputs',\s*\[[\s\S]*?\],\s*'Ekstra Form Alanları'\)\}/, newCareerInputs);
}

const defaultCareerInputs = `const DEFAULT_CAREER_INPUTS = [
  { type: 'text', label: 'Adınız', name: 'firstName', placeholder: 'Adınızı giriniz', required: true, icon: 'person', fullWidth: false },
  { type: 'text', label: 'Soyadınız', name: 'lastName', placeholder: 'Soyadınızı giriniz', required: true, icon: 'person', fullWidth: false },
  { type: 'email', label: 'E-Posta', name: 'email', placeholder: 'E-posta adresinizi giriniz', required: true, icon: 'mail', fullWidth: false },
  { type: 'tel', label: 'Telefon', name: 'phone', placeholder: 'Telefon numaranızı giriniz', required: true, icon: 'phone', fullWidth: false },
  { type: 'select', label: 'Başvurduğunuz Pozisyon', name: 'position', required: true, icon: 'work', fullWidth: true, options: 'Lise Öğretmenliği,Ortaokul Öğretmenliği,İlkokul Öğretmenliği,Anaokulu Öğretmenliği,Rehberlik ve Psikolojik Danışmanlık,İdari Personel,Temizlik / Güvenlik' },
  { type: 'file', label: 'Özgeçmiş (CV) Yükle', name: 'cv', required: true, icon: 'upload_file', fullWidth: true },
  { type: 'textarea', label: 'Ön Yazı / Eklemek İstedikleriniz', name: 'message', placeholder: 'Kendinizden kısaca bahsediniz...', required: false, icon: 'edit', fullWidth: true },
  { type: 'checkbox', label: 'KVKK Aydınlatma Metnini okudum ve kabul ediyorum.', name: 'kvkk', required: true, fullWidth: true }
];`;

file = file.replace("const DEFAULT_CLUB_INPUTS", defaultCareerInputs + "\n\nconst DEFAULT_CLUB_INPUTS");

file = file.replace(
  "if (block.type === 'club_registration_form') return DEFAULT_CLUB_INPUTS;",
  "if (block.type === 'club_registration_form') return DEFAULT_CLUB_INPUTS;\n      if (block.type === 'career_application') return DEFAULT_CAREER_INPUTS;"
);

// We need to check if career_application warning is updated
file = file.replace(
  `<div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm mb-4">
              <strong>Bilgi:</strong> Ad, Soyad, E-posta, Telefon, CV ve Ön Yazı alanları bu bloğa standart olarak gömülüdür. 
              Sadece ekstra alan isterseniz veya "Pozisyon Seçin" seçenekleri vb. eklemek isterseniz bu bölümü kullanabilirsiniz.
              Şu an "Pozisyon Seçin" seçenekleri "Açık Pozisyonlar" (items) listesinden otomatik doldurulacaktır.
            </div>`,
  ``
);


fs.writeFileSync('./src/admin/BlockFormEditor.tsx', file);
