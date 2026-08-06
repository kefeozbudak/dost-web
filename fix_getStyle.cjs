const fs = require('fs');
let content = fs.readFileSync('src/components/PageBlocks.tsx', 'utf8');

// Replace the return block in getStyle to include background Image
content = content.replace(/borderRadius: block\.styles\?\.\[prefix \+ "BorderRadius"\]\n\s+\? block\.styles\[prefix \+ "BorderRadius"\] \+ "px"\n\s+: undefined,\n\s+\};\n\s+\};/, 
  `borderRadius: block.styles?.[prefix + "BorderRadius"]
        ? block.styles[prefix + "BorderRadius"] + "px"
        : undefined,
      backgroundImage: (prefix === "" || prefix === "container") && block.styles?.backgroundImage ? \`url(\${block.styles.backgroundImage})\` : undefined,
      backgroundSize: (prefix === "" || prefix === "container") && block.styles?.backgroundImage ? 'cover' : undefined,
      backgroundPosition: (prefix === "" || prefix === "container") && block.styles?.backgroundImage ? 'center' : undefined,
    };
  };`);

fs.writeFileSync('src/components/PageBlocks.tsx', content);
console.log("Fixed getStyle");
