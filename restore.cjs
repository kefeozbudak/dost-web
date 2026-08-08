const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const target = 'import ErrorBoundary from "./ErrorBoundary";';
const lastIndex = code.lastIndexOf(target);

if (lastIndex !== -1) {
  // Wait, let's make sure it's the right one.
  const restored = code.substring(lastIndex);
  fs.writeFileSync('src/components/PageBlocks.tsx', restored);
  console.log("Restored successfully!");
}
