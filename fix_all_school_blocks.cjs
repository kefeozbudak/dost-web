const fs = require('fs');

const file = 'src/components/SchoolBlocks.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. SchoolBranchesBlock
content = content.replace(
  /<div key=\{idx\} className="bg-white rounded-xl border border-\[#e2e8f0\] overflow-hidden shadow-sm hover:shadow-md transition-shadow group">/g,
  '<div key={idx} className={getCardClass(item, "bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md transition-shadow group")} style={getCardStyle(item, block)}>'
);
content = content.replace(
  /<div className=\{`\$\{iconColor\} text-4xl mb-4`\}>/g,
  '<div className={`text-4xl mb-4 ${iconColor}`} style={getIconStyle(item, block)}>'
);
content = content.replace(
  /<h3 className="text-xl font-bold text-\[#1a1b23\] mb-2 leading-\[1\.4\]">\{item\.title\}<\/h3>/g,
  '<h3 className="text-xl font-bold text-[#1a1b23] mb-2 leading-[1.4]" style={getCardTitleStyle(item, block)}>{item.title}</h3>'
);
content = content.replace(
  /<p className="text-\[#434654\] text-sm leading-relaxed mb-4">\{item\.desc\}<\/p>/g,
  '<p className="text-[#434654] text-sm leading-relaxed mb-4" style={getCardDescStyle(item, block)}>{item.desc}</p>'
);
content = content.replace(
  /<a href=\{item\.url \|\| "#"\} className=\{`inline-flex items-center gap-2 text-sm font-bold mt-auto \$\{iconColor\} hover:opacity-80 transition-opacity w-fit cursor-pointer`\}>/g,
  '<a href={item.url || "#"} className={`inline-flex items-center gap-2 text-sm font-bold mt-auto hover:opacity-80 transition-opacity w-fit cursor-pointer ${iconColor}`} style={getItemButtonStyle(block)}>'
);


// 2. SchoolPedagogyBlock
content = content.replace(
  /<div className="text-\[#1d4eca\] text-2xl shrink-0">/g,
  '<div className="text-[#1d4eca] text-2xl shrink-0" style={getIconStyle(item, block)}>'
);
content = content.replace(
  /<h3 className="text-lg font-bold text-\[#1a1b23\] mb-1">\{item\.title\}<\/h3>/g,
  '<h3 className="text-lg font-bold text-[#1a1b23] mb-1" style={getCardTitleStyle(item, block)}>{item.title}</h3>'
);
content = content.replace(
  /<p className="text-\[#434654\]">\{item\.desc\}<\/p>/g,
  '<p className="text-[#434654]" style={getCardDescStyle(item, block)}>{item.desc}</p>'
);

// 3. SchoolLgsBlock
content = content.replace(
  /<div key=\{idx\} className=\{`\$\{block\.styles\?\.innerBgOpacity === 0 \? "bg-white border-slate-200 shadow-sm" : "bg-\\[#2f3038\\]\/50 border-\\[#434654\\]\/50 text-white"\} p-6 rounded-2xl border backdrop-blur-sm`\}>/g,
  '<div key={idx} className={getCardClass(item, `${block.styles?.innerBgOpacity === 0 ? "bg-white border-slate-200 shadow-sm" : "bg-[#2f3038]/50 border-[#434654]/50 text-white"} p-6 rounded-2xl border backdrop-blur-sm`)} style={getCardStyle(item, block)}>'
);
content = content.replace(
  /<div className="w-12 h-12 bg-\[#3f68e4\]\/20 rounded-lg flex items-center justify-center mb-4 text-\[#61f9e9\]">/g,
  '<div className="w-12 h-12 bg-[#3f68e4]/20 rounded-lg flex items-center justify-center mb-4 text-[#61f9e9]" style={getIconStyle(item, block)}>'
);
content = content.replace(
  /<h3 className=\{`text-xl font-bold mb-2 \$\{block\.styles\?\.innerBgOpacity === 0 \? "text-\\[#1e293b\\]" : "text-white"\}`\}>\{item\.title\}<\/h3>/g,
  '<h3 className={`text-xl font-bold mb-2 ${block.styles?.innerBgOpacity === 0 ? "text-[#1e293b]" : "text-white"}`} style={getCardTitleStyle(item, block)}>{item.title}</h3>'
);
content = content.replace(
  /<p className=\{`text-sm \$\{block\.styles\?\.innerBgOpacity === 0 \? "text-slate-600" : "text-slate-300"\}`\}>\{item\.desc\}<\/p>/g,
  '<p className={`text-sm ${block.styles?.innerBgOpacity === 0 ? "text-slate-600" : "text-slate-300"}`} style={getCardDescStyle(item, block)}>{item.desc}</p>'
);

// 4. HighSchoolProgramsBlock
content = content.replace(
  /<div key=\{idx\} className="bg-white rounded-2xl p-8 border border-\[#e2e8f0\] shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">/g,
  '<div key={idx} className={getCardClass(item, "bg-white rounded-2xl p-8 border border-[#e2e8f0] shadow-sm hover:shadow-lg transition-all relative overflow-hidden group")} style={getCardStyle(item, block)}>'
);
content = content.replace(
  /<div className=\{`w-14 h-14 \$\{iconBg\} rounded-xl flex items-center justify-center mb-6 \$\{colorClass\} relative z-10`\}>/g,
  '<div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-6 ${colorClass} relative z-10`} style={getIconStyle(item, block)}>'
);
content = content.replace(
  /<h3 className="text-2xl font-bold text-\[#1a1b23\] mb-3 leading-\[1\.3\] relative z-10">\{item\.title\}<\/h3>/g,
  '<h3 className="text-2xl font-bold text-[#1a1b23] mb-3 leading-[1.3] relative z-10" style={getCardTitleStyle(item, block)}>{item.title}</h3>'
);
content = content.replace(
  /<p className="text-\[#434654\] leading-relaxed mb-6 relative z-10">\{item\.desc\}<\/p>/g,
  '<p className="text-[#434654] leading-relaxed mb-6 relative z-10" style={getCardDescStyle(item, block)}>{item.desc}</p>'
);


fs.writeFileSync(file, content);
console.log("Patched all remaining components in SchoolBlocks");
