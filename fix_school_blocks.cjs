const fs = require('fs');
let content = fs.readFileSync('src/components/SchoolBlocks.tsx', 'utf8');

const importStatement = `import { getStyle, getTitleStyle, getSubtitleStyle, getIconStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, getItemButtonStyle } from "../lib/styleUtils";\n`;
content = importStatement + content;

// Replace SchoolBentoBlock with the updated version that uses getCardStyle, getIconStyle, etc.
const oldSchoolBentoBlock = `export const SchoolBentoBlock = ({ block, getStyle, getTitleStyle, getSubtitleStyle }: any) => {
  const items = block.items || [];
  return (
    <section className="py-20 px-6 md:px-8 bg-[#f6f6f8] whitespace-pre-line" style={getStyle(block, "container")}>
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-[36px] font-bold text-[#1a1b23] mb-4 leading-[1.3]" style={getTitleStyle(block)}>{block.title}</h2>
          {block.subtitle && <p className="text-base text-[#434654]" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-auto md:auto-rows-[250px]">
          {items.map((item: any, idx: number) => {
            const isLarge = idx === 0 || idx === 3;
            const isPrimary = idx === 3;

            if (isPrimary) {
              return (
                <div key={idx} className={getCardClass(item, "md:col-span-2 bg-[#1d4eca] text-white rounded-xl shadow-sm p-8 flex flex-col justify-between relative overflow-hidden group")} style={getCardStyle(item, block)}>
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="text-[#61f9e9] text-[40px] mb-4" style={getIconStyle(item, block)}>
                        <IconPreview data={item.icon || 'forest'} />
                      </div>
                      <h3 className="text-[24px] font-bold mb-2 leading-[1.4]" style={getCardTitleStyle(item, block)}>{item.title}</h3>
                      <p className="max-w-md opacity-90" style={getCardDescStyle(item, block)}>{item.desc}</p>
                    </div>
                    <a href={item.url || "#"} className="inline-flex items-center gap-2 text-sm font-bold mt-4 hover:opacity-80 transition-opacity w-fit cursor-pointer" style={getItemButtonStyle(block)}>
                        {item.buttonText || "Kampüsümüzü İnceleyin"} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>
                  </div>
                  <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-l from-black/10 to-transparent z-0"></div>
                </div>
              );
            }

            if (isLarge) {
              return (
                <div key={idx} className={getCardClass(item, "md:col-span-2 bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-8 flex flex-col justify-between group hover:shadow-md transition-shadow relative overflow-hidden")} style={getCardStyle(item, block)}>
                  <div className="relative z-10">
                    <div className="text-[#1d4eca] text-[40px] mb-4" style={getIconStyle(item, block)}>
                      <IconPreview data={item.icon || 'psychology'} />
                    </div>
                    <h3 className="text-[24px] font-bold text-[#1a1b23] mb-2 leading-[1.4]" style={getCardTitleStyle(item, block)}>{item.title}</h3>
                    <p className="text-[#434654] max-w-md" style={getCardDescStyle(item, block)}>{item.desc}</p>
                  </div>
                  <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#f3f2fd] rounded-tl-full opacity-50 group-hover:scale-110 transition-transform z-0"></div>
                </div>
              );
            }

            return (
              <div key={idx} className={getCardClass(item, "bg-white rounded-xl border border-[#e2e8f0] shadow-sm p-8 flex flex-col justify-between hover:bg-[#f3f2fd] transition-colors group")} style={getCardStyle(item, block)}>
                <div>
                  <div className="text-[#006a62] text-[32px] mb-4" style={getIconStyle(item, block)}>
                    <IconPreview data={item.icon || 'favorite'} />
                  </div>
                  <h3 className="text-[14px] font-bold text-[#1a1b23] mb-2" style={getCardTitleStyle(item, block)}>{item.title}</h3>
                  <p className="text-[16px] text-[#434654]" style={getCardDescStyle(item, block)}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};`;

// Find the boundaries of the old SchoolBentoBlock in the file and replace it
const startIdx = content.indexOf('export const SchoolBentoBlock = ({ block');
const endIdx = content.indexOf('export const SchoolBranchesBlock =', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + oldSchoolBentoBlock + '\n\n' + content.substring(endIdx);
  fs.writeFileSync('src/components/SchoolBlocks.tsx', content);
  console.log("Patched SchoolBentoBlock");
} else {
  console.log("Could not find boundaries");
}
