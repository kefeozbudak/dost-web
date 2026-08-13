const fs = require('fs');

const file = 'src/components/AboutBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('styleUtils')) {
  content = `import { getStyle, getTitleStyle, getSubtitleStyle, getIconStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, getItemButtonStyle, getIndividualButtonStyle } from "../lib/styleUtils";\n` + content;
} else if (!content.includes('getIndividualButtonStyle')) {
  content = content.replace(
    'import { getStyle, getTitleStyle, getSubtitleStyle, getIconStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, getItemButtonStyle } from "../lib/styleUtils";',
    'import { getStyle, getTitleStyle, getSubtitleStyle, getIconStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, getItemButtonStyle, getIndividualButtonStyle } from "../lib/styleUtils";'
  );
}

// 1. In AboutHeroBlock, buttons are mapped.
// Replace className={`... ${btn.primary !== false ? ... : ...}`} with style={getIndividualButtonStyle(btn, block)} + some base classes.
content = content.replace(
  /className=\{`px-8 py-3 rounded-xl text-\[14px\] font-bold transition-colors \$\{btn\.primary !== false \? 'bg-white text-\[#1d4eca\] hover:opacity-90' : 'border-2 border-white text-white hover:bg-white\/10'\}`\}/g,
  'className={`px-8 py-3 rounded-xl text-[14px] font-bold transition-colors ${btn.primary !== false ? \'bg-white text-[#1d4eca] hover:opacity-90\' : \'border-2 border-white text-white hover:bg-white/10\'}`} style={getIndividualButtonStyle(btn, block)}'
);

// 2. In AkademikKadroBlock, map over items
content = content.replace(
  /<div key=\{idx\} className="bg-white rounded-xl shadow border border-slate-100 overflow-hidden group">/g,
  '<div key={idx} className={getCardClass(item, "bg-white rounded-xl shadow border border-slate-100 overflow-hidden group")} style={getCardStyle(item, block)}>'
);
content = content.replace(
  /<h3 className="text-lg font-bold text-slate-900 mb-1">\{item\.name\}<\/h3>/g,
  '<h3 className="text-lg font-bold text-slate-900 mb-1" style={getCardTitleStyle(item, block)}>{item.name}</h3>'
);
content = content.replace(
  /<p className="text-slate-500 text-sm">\{item\.desc\}<\/p>/g,
  '<p className="text-slate-500 text-sm" style={getCardDescStyle(item, block)}>{item.desc}</p>'
);
content = content.replace(
  /<p className="text-primary text-sm font-bold uppercase tracking-wider mb-2">\{item\.role\}<\/p>/g,
  '<p className="text-primary text-sm font-bold uppercase tracking-wider mb-2" style={getIconStyle(item, block)}>{item.role}</p>'
); // Assuming iconStyle can be used for the subtitle/role text color

// 3. In ValuesBlock
content = content.replace(
  /<div key=\{idx\} className="bg-white p-8 rounded-2xl border border-\[#e2e8f0\] hover:shadow-md transition-all">/g,
  '<div key={idx} className={getCardClass(item, "bg-white p-8 rounded-2xl border border-[#e2e8f0] hover:shadow-md transition-all")} style={getCardStyle(item, block)}>'
);
content = content.replace(
  /<div className=\{`\$\{iconColor\} text-3xl mb-4`\}>/g,
  '<div className={`text-3xl mb-4 text-[#1d4eca]`} style={getIconStyle(item, block)}>'
);
content = content.replace(
  /<h4 className="text-\[24px\] font-bold text-\[#0f172a\] mb-2 leading-\[1\.4\]">\{item\.title\}<\/h4>/g,
  '<h4 className="text-[24px] font-bold text-[#0f172a] mb-2 leading-[1.4]" style={getCardTitleStyle(item, block)}>{item.title}</h4>'
);
content = content.replace(
  /<p className="text-sm text-\[#64748b\]">\{item\.desc\}<\/p>/g,
  '<p className="text-sm text-[#64748b]" style={getCardDescStyle(item, block)}>{item.desc}</p>'
);

// 4. In MissionVisionBlock
content = content.replace(
  /<div key=\{idx\} className=\{`bg-white p-10 rounded-2xl border border-\[#e2e8f0\] shadow-sm flex flex-col items-center text-center group \$\{hoverBorder\} transition-colors duration-300`\}>/g,
  '<div key={idx} className={getCardClass(item, `bg-white p-10 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col items-center text-center group ${hoverBorder} transition-colors duration-300`)} style={getCardStyle(item, block)}>'
);
content = content.replace(
  /<div className=\{`w-16 h-16 \$\{colorBg\} rounded-full flex items-center justify-center mb-6 \$\{colorText\} group-hover:scale-110 transition-transform`\}>/g,
  '<div className={`w-16 h-16 ${colorBg} rounded-full flex items-center justify-center mb-6 ${colorText} group-hover:scale-110 transition-transform`} style={getIconStyle(item, block)}>'
);
content = content.replace(
  /<h2 className="text-\[36px\] font-bold mb-4 text-\[#1a1b23\] leading-\[1\.3\]">\{item\.title\}<\/h2>/g,
  '<h2 className="text-[36px] font-bold mb-4 text-[#1a1b23] leading-[1.3]" style={getCardTitleStyle(item, block)}>{item.title}</h2>'
);
content = content.replace(
  /<p className="text-\[#64748b\] leading-relaxed text-\[16px\]">\{item\.desc\}<\/p>/g,
  '<p className="text-[#64748b] leading-relaxed text-[16px]" style={getCardDescStyle(item, block)}>{item.desc}</p>'
);

fs.writeFileSync(file, content);
console.log("Patched AboutBlocks");
