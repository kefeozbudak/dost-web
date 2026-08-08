const fs = require('fs');
let code = fs.readFileSync('src/admin/BlockFormEditor.tsx', 'utf8');

// The pattern looks like:
// <div className="flex items-center gap-2"> (or similar, e.g. gap-1)
//   <input type="color" value={EXPR1} onChange={EXPR2} className="..." />
//   <input type="text" value={EXPR3} onChange={EXPR4} placeholder="..." className="..." />
// </div>

// We might have different variations. Let's count them.
const matches = [...code.matchAll(/<input\s+type="color"[\s\S]*?onChange=\{[\s\S]*?\}[^>]*>[\s\S]*?<input\s+type="text"[\s\S]*?>/g)];
console.log("Matches:", matches.length);

