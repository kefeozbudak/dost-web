const fs = require('fs');
let content = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

// For management_rector
content = content.replace(
  /\{block\.type === 'management_rector' && \(\s*<div className="space-y-4">\s*\{renderInputWithStyle\('İsim', 'title'\)\}/,
  `{block.type === 'management_rector' && (
          <div className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-xl space-y-4 mb-4">
               <h4 className="text-xs font-bold text-slate-500 uppercase">Bölüm Üst Bilgisi</h4>
               {renderCheckbox('Üst Bilgiyi (Rektör yazısını) Gizle', 'hideHeader')}
               {renderInputWithStyle('Bölüm Başlığı', 'sectionTitle')}
               {renderInputWithStyle('Bölüm İkonu (Material)', 'sectionIcon')}
               {renderCheckbox('Rozeti (Rektörlük Makamı) Gizle', 'hideBadge')}
               {renderInputWithStyle('Rozet Metni', 'badge')}
            </div>
            {renderInputWithStyle('İsim', 'title')}`
);

// For management_vice_rectors and management_deans
content = content.replace(
  /\{\(block\.type === 'management_vice_rectors' \|\| block\.type === 'management_deans'\) && \(\s*<div className="space-y-4">\s*\{renderInputWithStyle\('Bölüm Başlığı', 'title'\)\}/,
  `{(block.type === 'management_vice_rectors' || block.type === 'management_deans') && (
          <div className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-xl space-y-4 mb-4">
               <h4 className="text-xs font-bold text-slate-500 uppercase">Bölüm Üst Bilgisi</h4>
               {renderCheckbox('Bölüm Başlığını Gizle', 'hideHeader')}
               {renderInputWithStyle('Bölüm Başlığı', 'title')}
               {renderInputWithStyle('Bölüm İkonu (Material)', 'sectionIcon')}
               {renderTextareaWithStyle('Bölüm Açıklaması', 'subtitle')}
            </div>`
);
// Remove the original subtitle field since it's now in the header group
content = content.replace(
  /\{renderTextareaWithStyle\('Bölüm Açıklaması', 'subtitle'\)\}\s*\{renderArrayEditor\(/,
  `{renderArrayEditor(`
);

fs.writeFileSync('src/admin/BlockFormEditor.tsx', content);
