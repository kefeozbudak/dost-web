const fs = require('fs');

// 1. Update defaultFormInputs.ts
let defaultFormInputs = fs.readFileSync('./src/lib/defaultFormInputs.ts', 'utf8');

const careerInputs = `
export const DEFAULT_CAREER_INPUTS = [
  { type: 'section_title', label: 'Kişisel Bilgiler', icon: 'person' },
  { type: 'text', name: 'firstName', label: 'Adınız', placeholder: 'Örn: Ahmet', required: true },
  { type: 'text', name: 'lastName', label: 'Soyadınız', placeholder: 'Örn: Yılmaz', required: true },
  { type: 'email', name: 'email', label: 'E-posta Adresi', placeholder: 'ornek@email.com', required: true },
  { type: 'tel', name: 'phone', label: 'Telefon Numarası', placeholder: '05XX XXX XX XX', required: true },
  { type: 'section_title', label: 'Başvuru Detayları', icon: 'work' },
  { type: 'select', name: 'position', label: 'Başvurduğunuz Pozisyon', options: 'Öğretmen, İdari Personel, Destek Personeli, Diğer / Genel Başvuru', required: true, fullWidth: true },
  { type: 'file', name: 'cv', label: 'CV (Özgeçmiş) Yükle', required: true, fullWidth: true },
  { type: 'textarea', name: 'coverLetter', label: 'Ön Yazı (Neden Biz?)', placeholder: 'Kendinizden ve hedeflerinizden kısaca bahsedin...', required: false, fullWidth: true },
  { type: 'checkbox', name: 'kvkk', label: 'KVKK Aydınlatma Metni\\'ni okudum, kişisel verilerimin iş başvuru süreçleri kapsamında işlenmesini onaylıyorum.', required: true, fullWidth: true }
];
`;

if (!defaultFormInputs.includes('DEFAULT_CAREER_INPUTS')) {
  fs.appendFileSync('./src/lib/defaultFormInputs.ts', careerInputs);
}


// 2. Update BlockFormEditor.tsx
let blockFormEditor = fs.readFileSync('./src/admin/BlockFormEditor.tsx', 'utf8');

if (!blockFormEditor.includes('DEFAULT_CAREER_INPUTS')) {
  blockFormEditor = blockFormEditor.replace(
    /import \{ DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS \} from '\.\.\/lib\/defaultFormInputs';/,
    `import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS, DEFAULT_CAREER_INPUTS } from '../lib/defaultFormInputs';`
  );
  fs.writeFileSync('./src/admin/BlockFormEditor.tsx', blockFormEditor);
}


// 3. Update PageBlocks.tsx
let pageBlocks = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');

if (!pageBlocks.includes('DEFAULT_CAREER_INPUTS')) {
  pageBlocks = pageBlocks.replace(
    /import \{ DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS \} from '\.\.\/lib\/defaultFormInputs';/,
    `import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS, DEFAULT_CAREER_INPUTS } from '../lib/defaultFormInputs';`
  );
  
  pageBlocks = pageBlocks.replace(
    /const defaultInputs = block\.inputs && block\.inputs\.length > 0 \? block\.inputs : \(type === 'club_registration_form' \? DEFAULT_CLUB_INPUTS : type === 'bursluluk_exam_form' \? DEFAULT_SCHOLARSHIP_INPUTS : DEFAULT_PRE_REGISTRATION_INPUTS\);/,
    `const defaultInputs = block.inputs && block.inputs.length > 0 ? block.inputs : (type === 'club_registration_form' ? DEFAULT_CLUB_INPUTS : type === 'bursluluk_exam_form' ? DEFAULT_SCHOLARSHIP_INPUTS : type === 'career_application' ? DEFAULT_CAREER_INPUTS : DEFAULT_PRE_REGISTRATION_INPUTS);`
  );
  
  fs.writeFileSync('./src/components/PageBlocks.tsx', pageBlocks);
}
