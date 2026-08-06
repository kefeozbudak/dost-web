const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

const heroes = [
  "campus_hero", "achievements_hero", "about_hero", "academic_hero", 
  "management_hero", "kindergarten_hero", "primary_school_hero"
];

for (const hero of heroes) {
  // Find case 'hero': or case "hero": and replace the next max-w-2xl or max-w-3xl
  const regex = new RegExp(`(case ['"]${hero}['"]:[\\s\\S]*?className=)"(max-w-[234]xl)"`, 'g');
  content = content.replace(regex, (match, p1, p2) => {
    return p1 + '{getHeroInnerClass(block, "' + p2 + '")}';
  });
}

const customHeroes = [
  "BurslulukHeroBlock", "CareerHeroBlock", "EduSystemHeroBlock"
];

for (const custom of customHeroes) {
  const regex = new RegExp(`(const ${custom} = [\\s\\S]*?className=)"(max-w-[234]xl)"`, 'g');
  content = content.replace(regex, (match, p1, p2) => {
    return p1 + '{getHeroInnerClass(block, "' + p2 + '")}';
  });
}

// Contact hero
content = content.replace(/(case "contact_hero":[\\s\\S]*?<div className=\{`)(.*?)(`\})/, (match, p1, p2, p3) => {
  return p1 + '${getHeroInnerClass(block, `' + p2 + '`)}' + p3;
});

// Clubs hero
content = content.replace(/(const ClubsHeroBlock = [\s\S]*?className=)"(max-w-[234]xl text-center)"/, (match, p1, p2) => {
  return p1 + '{getHeroInnerClass(block, "' + p2 + '")}';
});

// News hero
content = content.replace(/(case "news_hero":[\\s\\S]*?className=\{`)(max-w-4xl mx-auto \$\{block\.styles\?\.textAlign \? "" : "text-center"\})(`\})/, (match, p1, p2, p3) => {
  return p1 + '${getHeroInnerClass(block, `' + p2 + '`)}' + p3;
});

// General hero
content = content.replace(/(case "hero":[\\s\\S]*?className=\{`)(max-w-4xl mx-auto \$\{block\.styles\?\.textAlign \? "" : "text-center"\})( \$\{block\.fullWidth)/, (match, p1, p2, p3) => {
  return p1 + '${getHeroInnerClass(block, `' + p2 + '`)}' + p3;
});

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Replaced inner classes");
