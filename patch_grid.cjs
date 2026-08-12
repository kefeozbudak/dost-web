const fs = require('fs');
let content = fs.readFileSync('src/components/ManagementBlocks.tsx', 'utf8');

content = content.replace(
  /className=\{`grid gap-6 \$\{isDeans \? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"\}`\}/g,
  'className={`grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${items.length <= 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"}`}'
);

fs.writeFileSync('src/components/ManagementBlocks.tsx', content);
