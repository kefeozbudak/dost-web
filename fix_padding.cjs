const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(
  '<div className="bg-white border border-slate-200 rounded-xl p-6 md:p-10 shadow-sm relative" style={block.styles?.cardBgColor ? { backgroundColor: block.styles.cardBgColor } : {}}>',
  '<div className={type === "club_registration_form" ? "bg-white border border-slate-200 rounded-xl p-6 md:p-10 shadow-sm relative" : "relative"} style={type === "club_registration_form" && block.styles?.cardBgColor ? { backgroundColor: block.styles.cardBgColor } : {}}>'
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
