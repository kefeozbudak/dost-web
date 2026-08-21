with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code = f.read()

import_str = "import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS, DEFAULT_CAREER_INPUTS, DEFAULT_CONTACT_INPUTS } from '../lib/defaultFormInputs';"
new_import_str = "import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS, DEFAULT_CAREER_INPUTS, DEFAULT_CONTACT_INPUTS, DEFAULT_QUICK_CONTACT_INPUTS } from '../lib/defaultFormInputs';"

if import_str in code:
    code = code.replace(import_str, new_import_str)
    with open('src/admin/BlockFormEditor.tsx', 'w') as f:
        f.write(code)
    print("Fixed import!")
else:
    # Just append to imports
    print("Not found exactly, let's look for it")
