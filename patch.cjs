const fs = require('fs');
let text = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const target = `            />
          <section
            key={block.id}
            className="relative text-white`;

const replacement = `            />
          );
      default:
        if (block.type === "achievements_hero") {
        return (
          <section
            key={block.id}
            className="relative text-white`;

text = text.replace(target, replacement);
fs.writeFileSync('src/components/PageBlocks.tsx', text);
