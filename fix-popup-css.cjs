const fs = require('fs');

let css = fs.readFileSync('src/index.css', 'utf8');

css = css.replace(
  '.is-popup .md\\\\:w-2\\\\/3 {',
  '.is-popup .md\\\\:w-2\\\\/3,\n.is-popup .md\\\\:w-2\\\\/5,\n.is-popup .md\\\\:w-3\\\\/5 {'
);

fs.writeFileSync('src/index.css', css);
console.log("CSS updated with w-2/5 and w-3/5");
