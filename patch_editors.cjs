const fs = require('fs');

let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const targetStr = "{['pre_registration_form', 'club_registration_form', 'bursluluk_exam_form', 'career_application', 'contact_form'].includes(block.type) && (";

const newEditors = `
        {block.type === 'campuses' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'image', label: 'Kampüs Görseli', type: 'image' },
              { key: 'title', label: 'Kampüs Adı', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Buton Linki', type: 'url' },
            ], 'Kampüsler')}
          </div>
        )}

        {block.type === 'education_levels' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
              { key: 'title', label: 'Kategori Adı', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Buton Linki', type: 'url' }
            ], 'Kademeler')}
          </div>
        )}

        {block.type === 'edu_system_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderImageUpload('Görsel', 'image')}
          </div>
        )}

        {block.type === 'edu_system_levels' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor('items', [
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
              { key: 'title', label: 'Kategori Adı', type: 'text' },
              { key: 'desc', label: 'Açıklama', type: 'textarea' },
              { key: 'buttonText', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Buton Linki', type: 'url' }
            ], 'Kademeler')}
          </div>
        )}

        {block.type === 'edu_system_yadep' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor('items', [
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
              { key: 'title', label: 'Madde Başlığı', type: 'text' },
              { key: 'desc', label: 'Madde Açıklaması', type: 'textarea' }
            ], 'YADEP Maddeleri')}
          </div>
        )}

        {block.type === 'edu_system_philosophy' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Ana Açıklama', 'desc')}
            {renderImageUpload('Görsel', 'image')}
            {renderInputWithStyle('Kart İkonu', 'cardIcon')}
            {renderInputWithStyle('Kart Başlığı', 'cardTitle')}
            {renderTextareaWithStyle('Kart Açıklaması', 'cardDesc')}
            {renderArrayEditor('items', [
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
              { key: 'title', label: 'Madde Başlığı', type: 'text' },
              { key: 'desc', label: 'Madde Açıklaması', type: 'textarea' }
            ], 'Felsefe Maddeleri')}
          </div>
        )}

        {block.type === 'edu_system_cta' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'desc')}
            {renderArrayEditor('buttons', [
              { key: 'label', label: 'Buton Metni', type: 'text' },
              { key: 'url', label: 'Buton Linki', type: 'url' },
              { key: 'icon', label: 'İkon (Material)', type: 'text' },
            ], 'Butonlar')}
          </div>
        )}

`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newEditors + targetStr);
  fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
  console.log("Patched BlockFormEditor successfully");
} else {
  console.log("Could not find target string");
}
