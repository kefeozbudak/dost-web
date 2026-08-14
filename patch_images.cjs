const fs = require('fs');

const files = [
  'src/components/ManagementBlocks.tsx',
  'src/components/AboutBlocks.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/h-64/g, 'aspect-square w-full');
  fs.writeFileSync(file, content);
  console.log(`Patched ${file}`);
});
