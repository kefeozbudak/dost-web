const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf-8');

const target = `<p className="text-[#D4AF37] font-bold text-xl md:text-2xl whitespace-normal md:whitespace-pre-line">
                  {stat.value}
                </p>
                <p className="text-sm opacity-80 whitespace-normal md:whitespace-pre-line">
                  {stat.label}
                </p>`;

const replacement = `<p className="font-bold text-xl md:text-2xl whitespace-normal md:whitespace-pre-line"
                   style={{ color: '#D4AF37', ...getCardTitleStyle(stat, block) }}>
                  {stat.value}
                </p>
                <p className="text-sm opacity-80 whitespace-normal md:whitespace-pre-line"
                   style={getCardDescStyle(stat, block)}>
                  {stat.label}
                </p>`;

if(content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync('src/components/PageBlocks.tsx', content);
  console.log("Patched BurslulukHeroBlock");
} else {
  console.log("Target not found");
}
