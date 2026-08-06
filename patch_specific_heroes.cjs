const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// BurslulukHeroBlock
content = content.replace(
  /(<div className=")(max-w-2xl text-white)(">\s*<span)/,
  `$1{getHeroInnerClass(block, "$2")}$3`
);

// news_hero
content = content.replace(
  /(<div className=")(max-w-2xl text-on-primary)(">\s*\{block\.title)/,
  `$1{getHeroInnerClass(block, "$2")}$3`
);

// about_hero
content = content.replace(
  /(<div className=")(max-w-2xl text-white)(">\s*<h1)/,
  `$1{getHeroInnerClass(block, "$2")}$3`
);

// clubs_hero 
content = content.replace(
  /(<div className=\{`relative z-10 \$\{block\.styles\?\.textAlign \? "" : "text-center"\} px-gutter )(max-w-4xl)(`\}>\s*<h1)/,
  (match, p1, p2, p3) => {
     return `className={getHeroInnerClass(block, \`relative z-10 \${block.styles?.textAlign ? "" : "text-center"} px-gutter ${p2}\`)}>\n                    <h1`;
  }
);

// academic_hero text wrapper is already "max-w-3xl" or something? Let's check academic_hero
content = content.replace(
  /(<div className=")(max-w-3xl)(">\s*<h1 className="text-4xl)/,
  `$1{getHeroInnerClass(block, "$2")}$3`
);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Patched specific heroes");
