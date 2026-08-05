const fs = require('fs');
let file = fs.readFileSync('./src/admin/BlockFormEditor.tsx', 'utf8');

const targetStr = `{block.type === 'career_hero' && (`;

const newCode = `{block.type === 'edu_system_hero' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderInputWithStyle('Arka Plan Görseli', 'image')}
            {renderInputWithStyle('Görsel X Pozisyonu (%)', 'image_posX')}
            {renderInputWithStyle('Görsel Y Pozisyonu (%)', 'image_posY')}
            {renderInputWithStyle('Görsel Ölçeği (%)', 'image_scale')}
          </div>
        )}

        {block.type === 'edu_system_levels' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderListManager('Kademeler (Items)', 'items')}
          </div>
        )}

        {block.type === 'edu_system_yadep' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderListManager('YADEP Kartları (Items)', 'items')}
          </div>
        )}

        {block.type === 'edu_system_philosophy' && (
          <div className="space-y-4">
            {renderInputWithStyle('Rozet (Badge)', 'badge')}
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık (Açıklama)', 'subtitle')}
            {renderInputWithStyle('Görsel URL', 'image')}
            {renderInputWithStyle('Görsel X Pozisyonu (%)', 'image_posX')}
            {renderInputWithStyle('Görsel Y Pozisyonu (%)', 'image_posY')}
            {renderInputWithStyle('Görsel Ölçeği (%)', 'image_scale')}
            {renderInputWithStyle('Kayan Kart İkonu', 'cardIcon')}
            {renderInputWithStyle('Kayan Kart Başlığı', 'cardTitle')}
            {renderInputWithStyle('Kayan Kart Açıklaması', 'cardDesc')}
            {renderListManager('Özellikler (Items)', 'items')}
          </div>
        )}

        {block.type === 'edu_system_cta' && (
          <div className="space-y-4">
            {renderInputWithStyle('Başlık', 'title')}
            {renderInputWithStyle('Alt Başlık', 'subtitle')}
            {renderListManager('Butonlar', 'buttons')}
          </div>
        )}

        {block.type === 'career_hero' && (`

file = file.replace(targetStr, newCode);
fs.writeFileSync('./src/admin/BlockFormEditor.tsx', file);
