const fs = require('fs');
let file = fs.readFileSync('./src/admin/BlockFormEditor.tsx', 'utf8');

const careerEditor = `        {block.type === 'career_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Hero Başlığı', 'title')}
            {renderInputWithStyle('Hero Alt Başlığı', 'subtitle')}
            {renderInputWithStyle('Arka Plan Görseli URL', 'image')}
            {renderInputWithStyle('Buton Metni', 'buttonText')}
          </div>
        )}
        
        {block.type === 'career_benefits' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderListManager('Avantajlar (Items)', 'items')}
          </div>
        )}

        {block.type === 'career_application' && (
          <div className="space-y-4">
            {renderInputWithStyle('Pozisyonlar Başlığı', 'title')}
            {renderListManager('Açık Pozisyonlar (Items)', 'items')}
            
            <div className="border-t border-slate-200 my-6"></div>
            
            <h4 className="text-sm font-bold text-slate-800 mb-4">Form Alanları (Inputs)</h4>
            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-sm mb-4">
              <strong>Bilgi:</strong> Ad, Soyad, E-posta, Telefon, CV ve Ön Yazı alanları bu bloğa standart olarak gömülüdür. 
              Sadece ekstra alan isterseniz veya "Pozisyon Seçin" seçenekleri vb. eklemek isterseniz bu bölümü kullanabilirsiniz.
              Şu an "Pozisyon Seçin" seçenekleri "Açık Pozisyonlar" (items) listesinden otomatik doldurulacaktır.
            </div>
            {renderListManager('Ekstra Form Alanları', 'inputs')}
          </div>
        )}
`;

file = file.replace("{block.type === 'bursluluk_hero' && (", careerEditor + "\n        {block.type === 'bursluluk_hero' && (");
fs.writeFileSync('./src/admin/BlockFormEditor.tsx', file);
