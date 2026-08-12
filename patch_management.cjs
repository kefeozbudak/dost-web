const fs = require('fs');
let content = fs.readFileSync('src/components/ManagementBlocks.tsx', 'utf8');

// Replace ManagementRectorBlock header
content = content.replace(
  /<div className="flex items-center gap-3 mb-6 border-b border-primary\/20 pb-2">\s*<span className="material-symbols-outlined text-primary">school<\/span>\s*<h2 className="text-2xl font-bold text-slate-900">Rektör<\/h2>\s*<\/div>/g,
  `{block.hideHeader !== true && (
      <div className="flex items-center gap-3 mb-6 border-b border-primary/20 pb-2">
        {block.sectionIcon !== '' && <span className="material-symbols-outlined text-primary">{block.sectionIcon || "school"}</span>}
        <h2 className="text-2xl font-bold text-slate-900">{block.sectionTitle || "Rektör"}</h2>
      </div>
  )}`
);

// Replace ManagementRectorBlock badge
content = content.replace(
  /<span className="inline-block px-3 py-1 rounded bg-primary text-white text-xs font-bold uppercase tracking-widest">Rektörlük Makamı<\/span>/g,
  `{block.hideBadge !== true && (
    <span className="inline-block px-3 py-1 rounded bg-primary text-white text-xs font-bold uppercase tracking-widest">
      {block.badge || "Rektörlük Makamı"}
    </span>
  )}`
);

// Replace ManagementTeamGridBlock headers
content = content.replace(
  /\{isDeans \? \(\s*<>\s*<div className="flex items-center gap-3">\s*<span className="material-symbols-outlined text-primary">account_balance<\/span>\s*<h2 className="text-2xl font-bold text-slate-900" style=\{getTitleStyle\(block\)\}>\{block\.title \|\| "Fakülte Dekanları"\}<\/h2>\s*<\/div>\s*\{block\.subtitle && <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block" style=\{getSubtitleStyle\(block\)\}>\{block\.subtitle\}<\/div>\}\s*<\/>\s*\) : \(\s*<>\s*<span className="material-symbols-outlined text-primary">groups<\/span>\s*<h2 className="text-2xl font-bold text-slate-900" style=\{getTitleStyle\(block\)\}>\{block\.title \|\| "Rektör Yardımcıları & Genel Sekreter"\}<\/h2>\s*\{block\.subtitle && <p className="text-sm text-slate-500 ml-4 hidden md:block" style=\{getSubtitleStyle\(block\)\}>\{block\.subtitle\}<\/p>\}\s*<\/>\s*\)\}/g,
  `{isDeans ? (
          <>
            <div className="flex items-center gap-3">
              {block.sectionIcon !== '' && <span className="material-symbols-outlined text-primary">{block.sectionIcon || "account_balance"}</span>}
              <h2 className="text-2xl font-bold text-slate-900" style={getTitleStyle(block)}>{block.title || "Fakülte Dekanları"}</h2>
            </div>
            {block.subtitle && <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block" style={getSubtitleStyle(block)}>{block.subtitle}</div>}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {block.sectionIcon !== '' && <span className="material-symbols-outlined text-primary">{block.sectionIcon || "groups"}</span>}
              <h2 className="text-2xl font-bold text-slate-900" style={getTitleStyle(block)}>{block.title || "Rektör Yardımcıları & Genel Sekreter"}</h2>
            </div>
            {block.subtitle && <p className="text-sm text-slate-500 ml-4 hidden md:block" style={getSubtitleStyle(block)}>{block.subtitle}</p>}
          </>
        )}`
);

// Wrap ManagementTeamGridBlock header in block.hideHeader
content = content.replace(
  /<div className=\{`flex items-center \$\{isDeans \? 'justify-between' : 'gap-3'\} mb-8 border-b border-primary\/20 pb-2`\}>([\s\S]*?)<\/div>/,
  `{block.hideHeader !== true && (
      <div className={\`flex items-center \${isDeans ? 'justify-between' : 'gap-3'} mb-8 border-b border-primary/20 pb-2\`}>
        $1
      </div>
    )}`
);

// ManagementTeamGridBlock grid classes:
// "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" -> "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4" (maybe)
// "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" -> "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4" (wait, I should just make it md:grid-cols-3)
content = content.replace(
  /className=\{`grid gap-6 \$\{isDeans \? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'\}`\}/g,
  'className={`grid gap-6 ${isDeans ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}'
);

fs.writeFileSync('src/components/ManagementBlocks.tsx', content);
