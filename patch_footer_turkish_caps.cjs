const fs = require('fs');
let file = fs.readFileSync('./src/components/Footer.tsx', 'utf8');

const helperStr = `
// Helper to capitalize words (Turkish support)
const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return '';
    return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
  }).join(' ');
};
`;

if (!file.includes('capitalizeWords')) {
  file = file.replace('export default function Footer', helperStr + '\nexport default function Footer');
}

file = file.replace(
  `                  {col.title}`,
  `                  {capitalizeWords(col.title)}`
);

file = file.replace(
  `                        <span title={link.label} className="truncate">{link.label}</span>`,
  `                        <span title={capitalizeWords(link.label)} className="truncate">{capitalizeWords(link.label)}</span>`
);

fs.writeFileSync('./src/components/Footer.tsx', file);
