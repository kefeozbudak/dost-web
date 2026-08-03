const fs = require('fs');
let content = fs.readFileSync('src/admin/hubs/ReportCenter.tsx', 'utf8');

const regex = /const handlePrint = \(target: 'all' \| any\) => \{[\s\S]*?\}\);/;

// We need to write a script that replaces handlePrint. Let's first extract handlePrint to see exactly where it ends.
