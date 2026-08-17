const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

const target = `{block.type === 'management_hero' && (`;

const addition = `
        {block.type === 'campus_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            {renderImageUpload('Arka Plan Görseli', 'image')}
            {renderButtonsArray('Butonlar')}
          </div>
        )}

        {block.type === 'campus_bento' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArray('items', [
              { key: 'title', label: 'Kart Başlığı', type: 'text' },
              { key: 'subtitle', label: 'Kart Açıklaması', type: 'textarea' },
              { key: 'image', label: 'Görsel', type: 'image' },
              { key: 'colSpan', label: 'Tailwind Sütun Sınıfı (örn: col-span-12 md:col-span-6 lg:col-span-4)', type: 'text' }
            ], 'Bento Kartları')}
          </div>
        )}

        {block.type === 'campus_gallery' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Alt Başlık', 'subtitle')}
            {renderArray('items', [
              { key: 'title', label: 'Görsel Başlığı (Opsiyonel)', type: 'text' },
              { key: 'desc', label: 'Açıklama (Opsiyonel)', type: 'textarea' },
              { key: 'image', label: 'Görsel', type: 'image' }
            ], 'Galeri Görselleri')}
          </div>
        )}

        {block.type === 'campus_life' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık Bölüm 1', 'titlePart1')}
            {renderInputWithStyle('Başlık Bölüm 2', 'titlePart2')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            
            <div className="grid grid-cols-2 gap-4">
              {renderImageUpload('Görsel 1', 'image1')}
              {renderImageUpload('Görsel 2', 'image2')}
              {renderImageUpload('Görsel 3', 'image3')}
              {renderImageUpload('Görsel 4', 'image4')}
            </div>

            {renderArray('items', [
              { key: 'title', label: 'Özellik Başlığı', type: 'text' },
              { key: 'icon', label: 'İkon', type: 'icon' }
            ], 'Özellik Listesi')}
            
            {renderButtonsArray('Butonlar')}
          </div>
        )}

        {block.type === 'campus_contact' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderTextareaWithStyle('Açıklama', 'subtitle')}
            
            {renderArray('items', [
              { key: 'title', label: 'Bilgi Başlığı', type: 'text' },
              { key: 'desc', label: 'Detay/Adres/Telefon', type: 'textarea' },
              { key: 'icon', label: 'İkon', type: 'icon' }
            ], 'İletişim Bilgileri')}

            <div className="bg-slate-100 p-4 rounded-xl space-y-4 mt-6">
              <h4 className="font-bold text-sm text-slate-700">Harita Alanı</h4>
              {renderTextareaWithStyle('Harita Kodu (iframe)', 'mapCode')}
              <p className="text-xs text-slate-500">
                Harita kodu eklendiğinde görsel ve kart bölümü gizlenir. Sadece görsel ve kart göstermek istiyorsanız bu alanı boş bırakın.
              </p>
            </div>
            
            {!block.mapCode && (
              <div className="bg-slate-50 p-4 rounded-xl space-y-4 mt-4 border border-slate-200">
                <h4 className="font-bold text-sm text-slate-700">Görsel ve Yönlendirme Kartı (Harita yoksa görünür)</h4>
                {renderImageUpload('Harita/Kampüs Görseli', 'image')}
                {renderInputWithStyle('Kart Başlığı', 'cardTitle')}
                {renderInputWithStyle('Kart Açıklaması', 'cardDesc')}
                {renderButtonsArray('Yönlendirme Butonu (Sadece 1. buton görünür)')}
              </div>
            )}
          </div>
        )}

        `;

code = code.replace(target, addition + target);
fs.writeFileSync('src/admin/BlockFormEditor.tsx', code);
console.log("Patched BlockFormEditor");
