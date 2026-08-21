with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

start_idx = code.find('const QuickContactFormBlock = ({')
end_idx = code.find('};', start_idx) + 2

old_block = code[start_idx:end_idx]

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
      className="py-section-gap w-full flex items-center justify-center p-4 md:p-8 whitespace-normal md:whitespace-pre-line"
      style={getStyle(block, "container")}
    >
      <div
        className="w-full max-w-4xl bg-surface-card rounded-lg shadow-sm border border-border-subtle overflow-hidden relative whitespace-normal md:whitespace-pre-line"
        style={
          block.styles?.cardBgColor
            ? { backgroundColor: block.styles.cardBgColor }
            : {}
        }
      >
        {/* Header */}
        <div
          className={`p-8 md:p-12 ${block.styles?.textAlign ? "" : "text-center"} relative overflow-hidden`}
          style={{ backgroundColor: block.styles?.headerBgColor || "#002147" }}
        >
          <div className="relative z-10 whitespace-normal md:whitespace-pre-line">
            <h1
              className="font-headline-md text-headline-md text-white mb-2 uppercase tracking-wide whitespace-normal md:whitespace-pre-line"
              style={getTitleStyle(block)}
            >
              {block.title || "HIZLI İLETİŞİM FORMU"}
            </h1>
            <p
              className="font-body-md text-body-md text-blue-200 whitespace-normal md:whitespace-pre-line"
              style={getSubtitleStyle(block)}
            >
              {block.subtitle || "Lütfen Formu Eksiksiz Doldurunuz."}
            </p>
            <div className="mt-6 flex justify-center whitespace-normal md:whitespace-pre-line">
              <div
                className="h-1 w-20 bg-primary rounded-full whitespace-normal md:whitespace-pre-line"
                style={
                  block.styles?.titlePart1Color
                    ? { backgroundColor: block.styles.titlePart1Color }
                    : { backgroundColor: "#004899" }
                }
              ></div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-12 bg-white whitespace-normal md:whitespace-pre-line">
          <DynamicFormBuilder getIconStyle={getIconStyle} block={block} type="quick_contact_form" />
        </div>
      </div>
    </section>
  );
};"""

if old_block in code:
    code = code.replace(old_block, new_block)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Patched successfully")
else:
    print("Could not find old block")
