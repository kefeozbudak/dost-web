const fs = require('fs');

let adminLayout = fs.readFileSync('./src/admin/AdminLayout.tsx', 'utf8');
if (!adminLayout.includes('defaultEgitimSistemiData')) {
    // it's already there
} else {
    if (!adminLayout.includes('import { defaultEgitimSistemiData }')) {
        adminLayout = adminLayout.replace(
            `import { useAuthStore } from '../store/authStore';`,
            `import { useAuthStore } from '../store/authStore';\nimport { defaultEgitimSistemiData } from '../lib/defaultData';`
        );
        fs.writeFileSync('./src/admin/AdminLayout.tsx', adminLayout);
    }
}

let pageBlocks = fs.readFileSync('./src/components/PageBlocks.tsx', 'utf8');
if (pageBlocks.includes('DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS') && !pageBlocks.includes('DEFAULT_CAREER_INPUTS } from')) {
    pageBlocks = pageBlocks.replace(
        `import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS } from "../lib/defaultFormInputs";`,
        `import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS, DEFAULT_CAREER_INPUTS } from "../lib/defaultFormInputs";`
    );
    fs.writeFileSync('./src/components/PageBlocks.tsx', pageBlocks);
}
