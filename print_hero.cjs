const fs = require('fs');
const data = JSON.parse(fs.readFileSync('debug.json', 'utf-8'));
const home = data.bursluluk;
if (home && home.blocks) {
  const hero = home.blocks.find(b => b.type === 'hero');
  console.log(JSON.stringify(hero, null, 2));
} else {
  console.log("no hero");
}
