const fs = require('fs');
let content = fs.readFileSync('src/admin/AdminDashboard.tsx', 'utf8');

if (!content.includes('MigrateTuitionFees')) {
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport MigrateTuitionFees from './MigrateTuitionFees';");
    content = content.replace("return (", "return (\n    <>\n      <MigrateTuitionFees />");
    content = content.replace("export default function AdminDashboard() {", "export default function AdminDashboard() {");
    content = content + "\n</>;\n"; // Wait, replacing return ( with return (<> requires closing it. Let's just do a simpler replace.
}
