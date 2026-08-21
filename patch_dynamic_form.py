import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """  let defaultInputs =
    block.inputs && block.inputs.length > 0
      ? block.inputs
      : type === "club_registration_form"
        ? DEFAULT_CLUB_INPUTS
        : type === "bursluluk_exam_form"
          ? DEFAULT_SCHOLARSHIP_INPUTS
          : type === "career_application"
            ? DEFAULT_CAREER_INPUTS
            : type === "contact_form"
              ? DEFAULT_CONTACT_INPUTS
              : DEFAULT_PRE_REGISTRATION_INPUTS;"""

new_logic = """  let defaultInputs =
    block.inputs && block.inputs.length > 0
      ? block.inputs
      : type === "club_registration_form"
        ? DEFAULT_CLUB_INPUTS
        : type === "bursluluk_exam_form"
          ? DEFAULT_SCHOLARSHIP_INPUTS
          : type === "career_application"
            ? DEFAULT_CAREER_INPUTS
            : type === "contact_form"
              ? DEFAULT_CONTACT_INPUTS
              : type === "quick_contact_form"
                ? DEFAULT_QUICK_CONTACT_INPUTS
                : DEFAULT_PRE_REGISTRATION_INPUTS;"""

if target in code:
    code = code.replace(target, new_logic)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Patched DynamicFormBuilder defaults")
else:
    print("Could not find DynamicFormBuilder defaults")
