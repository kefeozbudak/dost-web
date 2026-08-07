const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/LgsCenter.tsx', 'utf8');

// Add imports
code = code.replace(
  /CheckCircle2,/,
  'CheckCircle2,\n  Printer,\n  ListChecks,\n  X,'
);

// Replace print button
code = code.replace(
  /<span className="material-symbols-outlined text-lg sm:hidden">print<\/span>\s*<span className="hidden sm:inline-flex items-center gap-2">\s*<span className="material-symbols-outlined text-lg">print<\/span>\s*Yazdır\s*<\/span>/,
  '<Printer className="w-4 h-4 sm:hidden" />\n                    <span className="hidden sm:inline-flex items-center gap-2">\n                      <Printer className="w-4 h-4" />\n                      Yazdır\n                    </span>'
);

// Replace Seç button
code = code.replace(
  /<span className="material-symbols-outlined text-lg sm:hidden">\s*\{isSelectionMode \? 'close' : 'checklist'\}\s*<\/span>\s*<span className="hidden sm:inline-flex items-center gap-2">\s*<span className="material-symbols-outlined text-lg">\s*\{isSelectionMode \? 'close' : 'checklist'\}\s*<\/span>\s*\{isSelectionMode \? 'İptal' : 'Seç'\}\s*<\/span>/,
  `{isSelectionMode ? <X className="w-4 h-4 sm:hidden" /> : <ListChecks className="w-4 h-4 sm:hidden" />}\n                    <span className="hidden sm:inline-flex items-center gap-2">\n                      {isSelectionMode ? <X className="w-4 h-4" /> : <ListChecks className="w-4 h-4" />}\n                      {isSelectionMode ? 'İptal' : 'Seç'}\n                    </span>`
);

fs.writeFileSync('src/admin/hubs/LgsCenter.tsx', code);
