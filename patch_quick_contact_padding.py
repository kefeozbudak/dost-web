with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """        <div className="p-6 md:p-12 bg-white whitespace-normal md:whitespace-pre-line">
          <DynamicFormBuilder getIconStyle={getIconStyle} block={block} type="quick_contact_form" />
        </div>"""

new_target = """        <div className="bg-white whitespace-normal md:whitespace-pre-line">
          <DynamicFormBuilder getIconStyle={getIconStyle} block={block} type="quick_contact_form" />
        </div>"""

if target in code:
    code = code.replace(target, new_target)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Patched QuickContactFormBlock padding!")
else:
    print("Not found")

