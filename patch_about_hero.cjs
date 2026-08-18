const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf-8');

const insertionPoint = "      <MediaPickerModal";
const insertionCode = `
      {block.type === 'about_hero' && (
        <div className="space-y-4">
          {renderHeroOverlaySetting()}
          {renderCommonFields()}
          {renderInputWithStyle("Rozet (Badge)", "badge")}
          {renderImageUpload("Arka Plan Görseli", "image")}
          {renderArrayEditor('buttons', [
            {key: 'label', label: 'Metin', type: 'text'}, 
            {key: 'url', label: 'URL', type: 'url'}, 
            {key: 'primary', label: 'Birincil Mi? (Boş veya true)', type: 'text'}
          ], 'Butonlar')}
        </div>
      )}
      
      {block.type === 'academic_hero' && (
        <div className="space-y-4">
          {renderCommonFields()}
          {renderImageUpload("Görsel", "image")}
        </div>
      )}

      {block.type === 'contact_hero' && (
        <div className="space-y-4">
          {renderCommonFields()}
        </div>
      )}
      
      `;

content = content.replace(insertionPoint, insertionCode + insertionPoint);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
console.log("Patched BlockFormEditor.tsx");
