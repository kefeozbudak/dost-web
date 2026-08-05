const fs = require('fs');

let blockFormEditor = fs.readFileSync('./src/admin/BlockFormEditor.tsx', 'utf8');
blockFormEditor = blockFormEditor.replace(
    /const defaults = block\.type === 'pre_registration_form' \? DEFAULT_PRE_REGISTRATION_INPUTS : \(block\.type === 'bursluluk_exam_form' \? DEFAULT_SCHOLARSHIP_INPUTS : DEFAULT_CLUB_INPUTS\);/,
    `const defaults = block.type === 'pre_registration_form' ? DEFAULT_PRE_REGISTRATION_INPUTS : (block.type === 'bursluluk_exam_form' ? DEFAULT_SCHOLARSHIP_INPUTS : block.type === 'career_application' ? DEFAULT_CAREER_INPUTS : DEFAULT_CLUB_INPUTS);`
);
fs.writeFileSync('./src/admin/BlockFormEditor.tsx', blockFormEditor);
