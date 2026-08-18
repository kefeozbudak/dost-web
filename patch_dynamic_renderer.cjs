const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

code = code.replace(
  /export const DynamicBlockRenderer = \(\{[\s\S]*?blocks,[\s\S]*?onBlockClick,[\s\S]*?\}\: \{[\s\S]*?blocks\: any\[\];[\s\S]*?onBlockClick\?\: \(index\: number, e\?\: React\.MouseEvent\) \=\> void;[\s\S]*?\}\) \=\> \{/,
  `import { ChevronLeft, ChevronRight } from 'lucide-react';\n\n$&
  const [calendarMonthOffsets, setCalendarMonthOffsets] = React.useState<Record<number, number>>({});`
);

// Menu Calendar
code = code.replace(
  /if \(block\.type === "menu_calendar"\) \{[\s\S]*?return \(/,
  `$&` // We will just insert the nav inside the JSX
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
