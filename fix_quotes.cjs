const fs = require('fs');
let code = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Fix CareerHeroBlock background image missing quotes
code = code.replace(
  /backgroundImage: \`url\(\$\{block\.image \|\| "https:\/\/images\.unsplash\.com\/photo-1522071820081-009f0129c71c\?ixlib=rb-4\.0\.3&auto=format&fit=crop&w=2850&q=80"\}\)\`,/,
  `backgroundImage: \`url('\${block.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2850&q=80"}')\`,`
);

// Reduce gradient opacity for CareerHeroBlock
code = code.replace(
  /className="absolute inset-0 bg-gradient-to-br from-\[\#002147\]\/90 to-\[\#1d4eca\]\/80 whitespace-normal md:whitespace-pre-line"><\/div>/,
  `className="absolute inset-0 bg-gradient-to-br from-[#002147]/70 to-[#1d4eca]/50 whitespace-normal md:whitespace-pre-line"></div>`
);

// Reduce gradient opacity for BurslulukHeroBlock
code = code.replace(
  /className="absolute inset-0 bg-gradient-to-r from-\[\#002147\]\/90 via-\[\#002147\]\/70 to-\[\#002147\]\/40 z-10 whitespace-normal md:whitespace-pre-line"><\/div>/,
  `className="absolute inset-0 bg-gradient-to-r from-[#002147]/70 via-[#002147]/50 to-[#002147]/30 z-10 whitespace-normal md:whitespace-pre-line"></div>`
);

fs.writeFileSync('src/components/PageBlocks.tsx', code);
