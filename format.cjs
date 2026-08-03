const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/ReportCenter.tsx', 'utf8');

// I will just use prettier or swc or something to format and find the error.
// The easiest is just removing one </div> until it builds.

const lines = code.split('\n');
// Let's remove the second to last </div>.
// Actually, let's just see where it says "JSX fragment has no corresponding closing tag."
