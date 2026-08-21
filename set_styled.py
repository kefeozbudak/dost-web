with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = 'const isStyledForm =\n    type === "pre_registration_form" || type === "bursluluk_exam_form";'
new_target = 'const isStyledForm =\n    type === "pre_registration_form" || type === "bursluluk_exam_form" || type === "quick_contact_form";'

if target in code:
    code = code.replace(target, new_target)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Patched isStyledForm!")
else:
    print("Not found isStyledForm exact")
