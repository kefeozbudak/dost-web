const fs = require('fs');
let code = fs.readFileSync('src/admin/CalendarGridEditor.tsx', 'utf8');
code = code.replace(
  /export default function CalendarGridEditor\(\{ block, arrayKey, onChange, activeArrayItem \}: \{ block: any, arrayKey: string, onChange: \(key: string, val: any\) => void, activeArrayItem\?: \{ arrayKey: string; index: number \} \| null \}\) \{ block, arrayKey, onChange \}: \{ block: any, arrayKey: string, onChange: \(key: string, val: any\) => void \}\) \{/,
  `export default function CalendarGridEditor({ block, arrayKey, onChange, activeArrayItem }: { block: any, arrayKey: string, onChange: (key: string, val: any) => void, activeArrayItem?: { arrayKey: string; index: number } | null }) {`
);
fs.writeFileSync('src/admin/CalendarGridEditor.tsx', code);
