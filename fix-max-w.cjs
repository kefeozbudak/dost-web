const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const replacements = [
  { search: 'className="font-body-md text-text-muted max-w-xl whitespace-pre-line"', replace: 'className={`font-body-md text-text-muted max-w-xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}' },
  { search: 'className="text-primary-fixed opacity-90 max-w-lg font-body-lg whitespace-pre-line"', replace: 'className={`text-primary-fixed opacity-90 max-w-lg font-body-lg ${getAlignClass(block, "subtitle")} whitespace-pre-line`}' },
  { search: 'className="text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl whitespace-pre-line"', replace: 'className={`text-gray-200 text-lg md:text-xl leading-relaxed max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}' },
  { search: 'className="text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed whitespace-pre-line"', replace: 'className={`text-lg md:text-xl text-slate-200 max-w-2xl font-light leading-relaxed ${getAlignClass(block, "subtitle")} whitespace-pre-line`}' },
  { search: 'className="font-body-lg text-body-lg text-on-surface-variant max-w-lg whitespace-pre-line"', replace: 'className={`font-body-lg text-body-lg text-on-surface-variant max-w-lg ${getAlignClass(block, "subtitle")} whitespace-pre-line`}' },
  { search: 'className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl whitespace-pre-line"', replace: 'className={`font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}' },
  { search: 'className="font-body-lg text-body-lg text-on-surface-variant max-w-xl whitespace-pre-line"', replace: 'className={`font-body-lg text-body-lg text-on-surface-variant max-w-xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}' },
  { search: 'className="font-body-lg text-body-lg text-on-primary-container max-w-2xl whitespace-pre-line"', replace: 'className={`font-body-lg text-body-lg text-on-primary-container max-w-2xl ${getAlignClass(block, "subtitle")} whitespace-pre-line`}' }
];

let updated = 0;
for (const r of replacements) {
  if (code.includes(r.search)) {
    code = code.replace(r.search, r.replace);
    updated++;
  } else {
    // try to find with regex
    const regex = new RegExp(r.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+'));
    if (regex.test(code)) {
      code = code.replace(regex, r.replace);
      updated++;
    }
  }
}

fs.writeFileSync('src/components/PageBlocks.tsx', code);
console.log(`Updated ${updated} instances of max-w missing getAlignClass`);
