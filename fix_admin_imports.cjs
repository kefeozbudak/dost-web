const fs = require('fs');

let blockFormEditor = fs.readFileSync('./src/admin/BlockFormEditor.tsx', 'utf8');
blockFormEditor = blockFormEditor.replace(
    /import \{ DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS \} from '\.\.\/lib\/defaultFormInputs';/,
    `import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS, DEFAULT_CAREER_INPUTS } from '../lib/defaultFormInputs';`
);
fs.writeFileSync('./src/admin/BlockFormEditor.tsx', blockFormEditor);
