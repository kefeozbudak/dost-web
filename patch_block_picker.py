import re

with open('src/admin/PageEditor.tsx', 'r') as f:
    code = f.read()

target = "{ type: 'contact_form', label: 'İletişim Formu' },"
new_target = target + "\n                          { type: 'quick_contact_form', label: 'Hızlı İletişim Formu' },"
code = code.replace(target, new_target)

with open('src/admin/PageEditor.tsx', 'w') as f:
    f.write(code)

with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    code2 = f.read()

target2 = 'if (block.type === "contact_form") return DEFAULT_CONTACT_INPUTS;'
new_target2 = target2 + '\n      if (block.type === "quick_contact_form") return DEFAULT_QUICK_CONTACT_INPUTS;'
code2 = code2.replace(target2, new_target2)

target3 = "import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS, DEFAULT_CAREER_INPUTS, DEFAULT_CONTACT_INPUTS } from '../lib/defaultFormInputs';"
new_target3 = "import { DEFAULT_PRE_REGISTRATION_INPUTS, DEFAULT_CLUB_INPUTS, DEFAULT_SCHOLARSHIP_INPUTS, DEFAULT_CAREER_INPUTS, DEFAULT_CONTACT_INPUTS, DEFAULT_QUICK_CONTACT_INPUTS } from '../lib/defaultFormInputs';"
code2 = code2.replace(target3, new_target3)

target4 = "['pre_registration_form', 'club_registration_form', 'bursluluk_exam_form', 'career_application', 'contact_form'].includes(block.type)"
new_target4 = "['pre_registration_form', 'club_registration_form', 'bursluluk_exam_form', 'career_application', 'contact_form', 'quick_contact_form'].includes(block.type)"
code2 = code2.replace(target4, new_target4)

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(code2)

print("Patched editor files")
