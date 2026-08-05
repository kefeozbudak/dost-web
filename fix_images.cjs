const fs = require('fs');
let file = fs.readFileSync('./src/admin/BlockFormEditor.tsx', 'utf8');

// fix edu_system_hero
file = file.replace(
`            {renderImageUpload('Arka Plan Görseli', 'image')}
            {renderInputWithStyle('Görsel X Pozisyonu (%)', 'image_posX')}
            {renderInputWithStyle('Görsel Y Pozisyonu (%)', 'image_posY')}
            {renderInputWithStyle('Görsel Ölçeği (%)', 'image_scale')}`,
`            {renderImageUpload('Arka Plan Görseli', 'image')}`
);

// fix edu_system_philosophy
file = file.replace(
`            {renderInputWithStyle('Görsel URL', 'image')}
            {renderInputWithStyle('Görsel X Pozisyonu (%)', 'image_posX')}
            {renderInputWithStyle('Görsel Y Pozisyonu (%)', 'image_posY')}
            {renderInputWithStyle('Görsel Ölçeği (%)', 'image_scale')}`,
`            {renderImageUpload('Görsel URL', 'image')}`
);

// fix career_hero
file = file.replace(
`            {renderInputWithStyle('Arka Plan Görseli URL', 'image')}`,
`            {renderImageUpload('Arka Plan Görseli URL', 'image')}`
);

fs.writeFileSync('./src/admin/BlockFormEditor.tsx', file);
