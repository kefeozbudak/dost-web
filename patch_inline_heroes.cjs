const fs = require('fs');

let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf-8');

// For campus_hero, contact_hero, clubs_hero, news_hero, hero, achievements_hero, menu_hero, academic_calendar_hero

const replacements = [
  // campus_hero: 2871
  // <section className="relative ... bg-primary ... <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent z-10
  {
    regex: /className="absolute inset-0 bg-gradient-to-r from-primary\/40 to-transparent z-10 whitespace-normal md:whitespace-pre-line"/g,
    replacement: 'className={getHeroOverlayClass(block, "absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent z-10 whitespace-normal md:whitespace-pre-line")}'
  },
  // contact_hero doesn't seem to have overlay? Let's check contact_hero.
  // clubs_hero: <div className="absolute inset-0 bg-primary/60 mix-blend-multiply whitespace-normal md:whitespace-pre-line"></div>
  {
    regex: /className="absolute inset-0 bg-primary\/60 mix-blend-multiply whitespace-normal md:whitespace-pre-line"/g,
    replacement: 'className={getHeroOverlayClass(block, "absolute inset-0 bg-primary/60 mix-blend-multiply whitespace-normal md:whitespace-pre-line")}'
  },
  // news_hero: <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/20 z-10 whitespace-normal md:whitespace-pre-line"></div>
  {
    regex: /className="absolute inset-0 bg-gradient-to-r from-primary\/60 to-primary\/20 z-10 whitespace-normal md:whitespace-pre-line"/g,
    replacement: 'className={getHeroOverlayClass(block, "absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/20 z-10 whitespace-normal md:whitespace-pre-line")}'
  },
  // achievements_hero: <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300 whitespace-normal md:whitespace-pre-line"></div>
  {
    regex: /className="absolute inset-0 bg-black\/40 group-hover:bg-black\/30 transition-colors duration-300 whitespace-normal md:whitespace-pre-line"/g,
    replacement: 'className={getHeroOverlayClass(block, "absolute inset-0 bg-black/40 whitespace-normal md:whitespace-pre-line")}'
  },
  // menu_hero: <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/10 whitespace-normal md:whitespace-pre-line"></div>
  {
    regex: /className="absolute inset-0 bg-gradient-to-r from-black\/40 to-black\/10 whitespace-normal md:whitespace-pre-line"/g,
    replacement: 'className={getHeroOverlayClass(block, "absolute inset-0 bg-gradient-to-r from-black/40 to-black/10 whitespace-normal md:whitespace-pre-line")}'
  }
];

replacements.forEach(({regex, replacement}) => {
  content = content.replace(regex, replacement);
});

// Also make sure their wrapper sections have 'group' class.
// We can just add 'group' to all 'className="relative ' if they are within these heroes.
// The safer way is to use regex: /case "clubs_hero":[\s\S]*?className="relative / -> add group
const inlineHeroes = ['campus_hero', 'contact_hero', 'clubs_hero', 'news_hero', 'achievements_hero', 'menu_hero'];

inlineHeroes.forEach(hero => {
  if (hero === 'menu_hero') {
    content = content.replace(
      /(if \(block\.type === "menu_hero"\) \{[\s\S]*?return \([\s\S]*?<section[^>]*className=")(relative [^"]*")/,
      '$1group $2'
    );
  } else {
    const regex = new RegExp(`(case "${hero}":[\\s\\S]*?return \\([\\s\\S]*?<section[^>]*className=")(relative [^"]*")`);
    content = content.replace(regex, '$1group $2');
  }
});

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Inline heroes patched.");
