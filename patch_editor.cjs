const fs = require('fs');
const file = 'src/admin/BlockFormEditor.tsx';
let content = fs.readFileSync(file, 'utf8');

const anchor = `        {block.type === 'mission_vision' && (`;
const injection = `        {block.type === 'career_benefits' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
                { key: 'iconColor', label: 'İkon Rengi (Tailwind Class)', type: 'text' },
                { key: 'iconBg', label: 'İkon Arka Planı (Tailwind Class)', type: 'text' },
                { key: 'borderTop', label: 'Üst Çizgi (Tailwind Class)', type: 'text' }
              ],
              'Avantajlar (Items)'
            )}
          </div>
        )}

`;

if(content.includes(anchor) && !content.includes("block.type === 'career_benefits' && (")) {
    content = content.replace(anchor, injection + anchor);
    fs.writeFileSync(file, content);
    console.log("Patched BlockFormEditor.tsx");
} else {
    console.log("Could not find anchor or already injected in BlockFormEditor.tsx");
}
