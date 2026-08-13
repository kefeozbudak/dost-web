const fs = require('fs');

const file = 'src/components/ManagementBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('styleUtils')) {
  content = `import { getStyle, getTitleStyle, getSubtitleStyle, getIconStyle, getCardStyle, getCardClass, getCardTitleStyle, getCardDescStyle, getItemButtonStyle, getIndividualButtonStyle } from "../lib/styleUtils";\n` + content;
}

// 1. ManagementHeroBlock
content = content.replace(
  /<h1\n\s*className=\{`text-4xl md:text-6xl font-black text-white mb-4 tracking-tight`\}\n\s*>\n\s*\{block\.title\}/g,
  '<h1\n            className={`text-4xl md:text-6xl font-black text-white mb-4 tracking-tight`}\n            style={getTitleStyle(block)}\n          >\n            {block.title}'
);
content = content.replace(
  /<p\n\s*className=\{`text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed`\}\n\s*>\n\s*\{block\.subtitle\}/g,
  '<p\n            className={`text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed`}\n            style={getSubtitleStyle(block)}\n          >\n            {block.subtitle}'
);

// 2. ManagementRectorBlock buttons
content = content.replace(
  /className=\{`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-all \$\{\n\s*btn\.style === "outline"\n\s*\? "border-2 border-primary text-primary hover:bg-primary\/5"\n\s*: "bg-primary text-white hover:bg-primary\/90 hover:shadow-lg"\n\s*\}`\}/g,
  'className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-all ${btn.style === "outline" ? "border-2 border-primary text-primary hover:bg-primary/5" : "bg-primary text-white hover:bg-primary/90 hover:shadow-lg"}`} style={getIndividualButtonStyle(btn, block)}'
);

// 3. ManagementTeamGridBlock
content = content.replace(
  /<div key=\{idx\} className="p-4 rounded-xl bg-white shadow hover:shadow-lg transition-shadow border border-slate-100 flex flex-col">/g,
  '<div key={idx} className={getCardClass(item, "p-4 rounded-xl bg-white shadow hover:shadow-lg transition-shadow border border-slate-100 flex flex-col")} style={getCardStyle(item, block)}>'
);
content = content.replace(
  /<div key=\{idx\} className="flex flex-col bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">/g,
  '<div key={idx} className={getCardClass(item, "flex flex-col bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300")} style={getCardStyle(item, block)}>'
);
content = content.replace(
  /<h5 className="text-md font-bold text-slate-900 leading-snug">\{item\.name\}<\/h5>/g,
  '<h5 className="text-md font-bold text-slate-900 leading-snug" style={getCardTitleStyle(item, block)}>{item.name}</h5>'
);
content = content.replace(
  /<h4 className="text-xl font-bold text-slate-900">\{item\.name\}<\/h4>/g,
  '<h4 className="text-xl font-bold text-slate-900" style={getCardTitleStyle(item, block)}>{item.name}</h4>'
);
content = content.replace(
  /<p className="text-xs text-slate-500">\{item\.role\}<\/p>/g,
  '<p className="text-xs text-slate-500" style={getCardDescStyle(item, block)}>{item.role}</p>'
);
content = content.replace(
  /<p className="text-sm text-slate-500 font-medium">\{item\.role\}<\/p>/g,
  '<p className="text-sm text-slate-500 font-medium" style={getCardDescStyle(item, block)}>{item.role}</p>'
);

fs.writeFileSync(file, content);
console.log("Patched ManagementBlocks");
