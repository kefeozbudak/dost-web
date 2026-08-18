const fs = require('fs');
let code = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

code = code.replace(
  /let explicitArrayIndex = -1;[\s\S]*?let currentItem = originalTarget;/,
  `let explicitArrayIndex = -1;\n        let explicitArrayKey = null;\n        let currentItem = originalTarget;`
);

code = code.replace(
  /explicitArrayIndex = parseInt\(currentItem\.getAttribute\('data-editor-item-index'\) \|\| '-1', 10\);/,
  `explicitArrayIndex = parseInt(currentItem.getAttribute('data-editor-item-index') || '-1', 10);\n                explicitArrayKey = currentItem.getAttribute('data-editor-array-key');`
);

const bestMatchFind = `        let bestMatch: { arrayKey: string, index: number } | null = null;
        let found = false;
        for (const arrKey of arrays) {
          if (block[arrKey] && Array.isArray(block[arrKey])) {
            if (explicitArrayIndex !== -1 && explicitArrayIndex < block[arrKey].length) {
                // If it's a known array key that we added explicit indexes for, use it.
                // Assuming explicit array indexes are mostly for 'items'.
                bestMatch = { arrayKey: arrKey, index: explicitArrayIndex };
                found = true;
                break;
            }`;

const bestMatchReplace = `        let bestMatch: { arrayKey: string, index: number } | null = null;
        let found = false;
        
        if (explicitArrayIndex !== -1 && explicitArrayKey) {
            bestMatch = { arrayKey: explicitArrayKey, index: explicitArrayIndex };
            found = true;
        } else {
          for (const arrKey of arrays) {
            if (block[arrKey] && Array.isArray(block[arrKey])) {
              if (explicitArrayIndex !== -1 && explicitArrayIndex < block[arrKey].length) {
                  bestMatch = { arrayKey: arrKey, index: explicitArrayIndex };
                  found = true;
                  break;
              }
            }
          }
        }
        
        if (!found) {
        for (const arrKey of arrays) {
          if (block[arrKey] && Array.isArray(block[arrKey])) {
            if (explicitArrayIndex !== -1 && explicitArrayIndex < block[arrKey].length) {
                // ...
            }`;

code = code.replace(bestMatchFind, bestMatchReplace);
fs.writeFileSync('src/admin/PageEditor.tsx', code);
