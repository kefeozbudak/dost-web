import fs from 'fs';

const file = 'src/admin/BlockFormEditor.tsx';
let content = fs.readFileSync(file, 'utf8');

const missingForms = `
        {block.type === 'achievements_hero' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithStyle('Badge (Rozet)', 'badge')}
              {renderImageUpload('Görsel URL', 'image')}
              {renderInputWithStyle('Başlık Bölüm 1', 'titlePart1')}
              {renderInputWithStyle('Başlık Bölüm 2', 'titlePart2')}
            </div>
            {renderTextareaWithStyle('Alt Başlık / Açıklama', 'subtitle')}
            {renderArrayEditor(
              'buttons',
              [
                {key: 'label', label: 'Metin', type: 'text'},
                {key: 'url', label: 'URL', type: 'text'},
                {key: 'icon', label: 'İkon', type: 'icon'},
                {key: 'bgColor', label: 'Arka Plan Rengi', type: 'color'},
                {key: 'textColor', label: 'Metin Rengi', type: 'color'}
              ],
              'Butonlar'
            )}
          </div>
        )}

        {block.type === 'achievements_academic_bento' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Başlığı', 'title')}
            {renderArrayEditor(
              'items',
              [
                {key: 'title', label: 'Başlık', type: 'text'},
                {key: 'desc', label: 'Açıklama', type: 'textarea'},
                {key: 'icon', label: 'İkon', type: 'icon'},
                {key: 'style', label: 'Stil Tipi (light, primary, list)', type: 'text'},
                {key: 'badge', label: 'Rozet (Opsiyonel)', type: 'text'},
                {key: 'statValue', label: 'Ana İstatistik', type: 'text'},
                {key: 'statLabel', label: 'Ana İstatistik Etiketi', type: 'text'},
                {key: 'buttonText', label: 'Buton Metni', type: 'text'},
                {key: 'url', label: 'Buton URL', type: 'text'}
              ],
              'Kartlar'
            )}
          </div>
        )}

        {block.type === 'achievements_social_gallery' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithStyle('Başlık', 'title')}
              {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            </div>
            {renderArrayEditor(
              'items',
              [
                {key: 'title', label: 'Kart Başlığı', type: 'text'},
                {key: 'desc', label: 'Açıklama', type: 'text'},
                {key: 'hoverText', label: 'Vurgu/Hover Metni', type: 'textarea'},
                {key: 'image', label: 'Görsel', type: 'image'}
              ],
              'Galeri Kartları'
            )}
          </div>
        )}

        {block.type === 'achievements_science_projects' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {renderInputWithStyle('Bölüm Rozeti', 'badge')}
              {renderInputWithStyle('Başlık', 'title')}
              {renderImageUpload('Görsel URL', 'image')}
              {renderInputWithStyle('Görsel Üzeri Rozet', 'imageBadge')}
            </div>
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                {key: 'title', label: 'Başlık', type: 'text'},
                {key: 'desc', label: 'Açıklama', type: 'textarea'},
                {key: 'icon', label: 'İkon', type: 'icon'}
              ],
              'Öğeler'
            )}
          </div>
        )}

        {block.type === 'bento_academic' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Başlık', 'title')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon', type: 'icon' },
                { key: 'stat', label: 'İstatistik (Kart 1)', type: 'text' },
                { key: 'statLabel', label: 'İstatistik Etiketi (Kart 1)', type: 'text' },
                { key: 'tag', label: 'Rozet/Etiket (Kart 1)', type: 'text' },
                { key: 'buttonText', label: 'Buton Metni (Kart 2)', type: 'text' },
                { key: 'url', label: 'Buton URL (Kart 2)', type: 'url' },
                { key: 'stat1Label', label: 'İstatistik 1 Etiketi (Kart 2)', type: 'text' },
                { key: 'stat1Value', label: 'İstatistik 1 Değeri (Kart 2)', type: 'text' },
                { key: 'stat2Label', label: 'İstatistik 2 Etiketi (Kart 2)', type: 'text' },
                { key: 'stat2Value', label: 'İstatistik 2 Değeri (Kart 2)', type: 'text' },
                { key: 'listString', label: 'Özellik Listesi (Kart 3 - Her satıra bir tane)', type: 'textarea' }
              ],
              'Öğeler (Max 3, Özel Tasarım)'
            )}
          </div>
        )}

        {block.type === 'high_school_programs' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Program Adı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
                { key: 'image', label: 'Program Görseli', type: 'image' },
                { key: 'buttonText', label: 'Buton Metni', type: 'text' },
                { key: 'url', label: 'Buton URL', type: 'url' },
                { key: 'listString', label: 'Özellikler (Her satıra bir tane)', type: 'textarea' }
              ],
              'Lise Programları'
            )}
          </div>
        )}

        {block.type === 'mission_vision' && (
          <div className="space-y-4">
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon', type: 'icon' }
              ],
              'Misyon & Vizyon Kartları'
            )}
          </div>
        )}

        {block.type === 'timeline' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'year', label: 'Yıl', type: 'text' },
                { key: 'title', label: 'Olay Başlığı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' }
              ],
              'Tarihçe Öğeleri'
            )}
          </div>
        )}

        {block.type === 'values' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderArrayEditor(
              'items',
              [
                { key: 'title', label: 'Değer Başlığı', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'icon', label: 'İkon', type: 'icon' }
              ],
              'Değerlerimiz Öğeleri'
            )}
          </div>
        )}

        {block.type === 'quote_image' && (
          <div className="space-y-4">
            {renderTextareaWithStyle('Alıntı Metni', 'quote')}
            {renderInputWithStyle('Yazar', 'author')}
            {renderInputWithStyle('Ünvan/Açıklama', 'authorTitle')}
            {renderImageUpload('Görsel', 'image')}
            {renderInputWithStyle('Alıntı Arka Plan Rengi', 'bgColor')}
            {renderInputWithStyle('Alıntı Metin Rengi', 'textColor')}
          </div>
        )}

        {block.type === 'features' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Rozeti (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderInputWithStyle('Alt Başlık Metin Rengi', 'subtitleColor')}
            {renderArrayEditor(
              'items',
              [
                { key: 'icon', label: 'İkon (Material)', type: 'icon' },
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' }
              ],
              'Özellikler'
            )}
          </div>
        )}

        {block.type === 'stats' && (
          <div className="space-y-4">
            {renderImageUpload('Arka Plan Görseli', 'image')}
            {renderArrayEditor(
              'items',
              [
                { key: 'value', label: 'İstatistik Değeri', type: 'text' },
                { key: 'label', label: 'Etiket', type: 'text' }
              ],
              'İstatistikler'
            )}
          </div>
        )}

        {block.type === 'grid' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArrayEditor(
              'items',
              [
                { key: 'image', label: 'Görsel', type: 'image' },
                { key: 'title', label: 'Başlık', type: 'text' },
                { key: 'desc', label: 'Açıklama', type: 'textarea' },
                { key: 'url', label: 'Tıklama Bağlantısı', type: 'url' },
                { key: 'icon', label: 'İkon (Material)', type: 'icon' }
              ],
              'Grid Öğeleri'
            )}
          </div>
        )}

        {block.type === 'text_image' && (
          <div className="space-y-4">
            {renderInputWithStyle('Bölüm Rozeti (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama (HTML destekli)', 'content')}
            {renderImageUpload('Görsel', 'image')}
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Görsel Yönü</label>
              <select
                value={block.imagePosition || 'right'}
                onChange={(e) => {
                  content = content; // hack to avoid closure issue, let's just use the replace logic instead
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm outline-none"
              >
                <option value="right">Sağda</option>
                <option value="left">Solda</option>
              </select>
            </div>
          </div>
        )}
`;

if (!content.includes("block.type === 'achievements_hero'")) {
  content = content.replace(
    '<MediaPickerModal',
    missingForms + '\n      <MediaPickerModal'
  );
  
  // Fix the select onChange manually since we are injecting code
  content = content.replace(
    `onChange={(e) => {
                  content = content; // hack to avoid closure issue, let's just use the replace logic instead
                }}`,
    `onChange={(e) => onChange({ ...block, imagePosition: e.target.value })}`
  );

  fs.writeFileSync(file, content);
  console.log("Successfully added missing blocks to BlockFormEditor.tsx");
} else {
  console.log("Blocks are already in BlockFormEditor.tsx");
}
