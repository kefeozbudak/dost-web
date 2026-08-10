import fs from 'fs';
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const heroes = ['kindergarten_hero', 'primary_school_hero', 'middle_school_hero', 'high_school_hero'];
heroes.forEach(h => {
  const casePattern = new RegExp(`(case "${h}":|if \\(block\\.type === "${h}"\\))([\\s\\S]*?)(<h1[\\s\\S]*?</h1>)`);
  const match = content.match(casePattern);
  if (match) {
    console.log(`\n\n--- ${h} ---`);
    console.log(match[3]);
  }
});
