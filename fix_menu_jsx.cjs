const fs = require('fs');
let content = fs.readFileSync('src/admin/AdminLayout.tsx', 'utf8');

// The block has:
// {hasPagesAccess && (
//   <div>
// ...
//                   )}
//                 </div>
//
//                 <div>

content = content.replace(/\{hasPagesAccess && \(\s+<div>/, '{hasPagesAccess && (\n                <>\n                <div>');

// Now find the end of the injected block which should be:
//                 </div>
//               )}
//               {filteredMenuItems.filter

content = content.replace(/                <\/div>\s+\)\}\s+\{filteredMenuItems\.filter/, '                </div>\n                </>\n              )}\n              {filteredMenuItems.filter');

fs.writeFileSync('src/admin/AdminLayout.tsx', content);
console.log("Fixed JSX wrapper");
