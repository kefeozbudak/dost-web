import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

new_block = """const QuickContactFormBlock = ({
  block,
  index,
  getStyle,
  getTitleStyle,
  getSubtitleStyle,
  getIconStyle
}: any) => {
  return (
    <section
      key={index}
      className="py-section-gap bg-surface-container-low whitespace-normal md:whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className={`${block.styles?.fullWidth ? "max-w-full px-0" : "max-w-container-max"} mx-auto px-margin-mobile md:px-margin-desktop max-w-xl`}
      >
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-border-subtle whitespace-normal md:whitespace-pre-line relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 bg-primary h-full"></div>
          <div className="mb-6 whitespace-normal md:whitespace-pre-line flex flex-row items-center gap-3 border-b border-slate-100 pb-4">
             <span className="material-symbols-outlined text-primary text-2xl">menu</span>
            <h2
              className="text-xl font-bold text-[#004899] whitespace-normal md:whitespace-pre-line m-0"
              style={getTitleStyle(block)}
            >
              {block.title || "Hızlı İletişim Formu"}
            </h2>
          </div>
          <DynamicFormBuilder getIconStyle={getIconStyle} block={block} type="quick_contact_form" />
        </div>
      </div>
    </section>
  );
};
"""

# Insert `QuickContactFormBlock` after `const ContactFormBlock = ...`
insert_idx = code.find("const ContactFormBlock =")
if insert_idx != -1:
    code = code[:insert_idx] + new_block + "\n" + code[insert_idx:]

    # Also add it to the switch case in `PageBlocks`
    switch_target = """        case "contact_form":"""
    switch_insert = """        case "quick_contact_form":
          return (
            <QuickContactFormBlock
              key={index}
              block={block}
              index={index}
              getStyle={getStyle}
              getIconStyle={getIconStyle}
              getTitleStyle={getTitleStyle}
              getSubtitleStyle={getSubtitleStyle}
            />
          );
"""
    if switch_target in code:
        code = code.replace(switch_target, switch_insert + switch_target)
        with open('src/components/PageBlocks.tsx', 'w') as f:
            f.write(code)
        print("Patched QuickContactFormBlock")
    else:
        print("Could not find switch_target")
else:
    print("Could not find ContactFormBlock")

