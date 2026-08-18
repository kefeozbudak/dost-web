const fs = require('fs');
let code = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

code = code.replace(
  /let explicitArrayIndex = -1;\s*\/\/\s*Look for data-editor-item-index in ancestors\s*let currentItem = originalTarget;\s*while\(currentItem && currentItem !== blockContainer\) \{\s*if \(currentItem\.hasAttribute\('data-editor-item-index'\)\) \{\s*explicitArrayIndex = parseInt\(currentItem\.getAttribute\('data-editor-item-index'\) \|\| '-1', 10\);\s*break;\s*\}\s*currentItem = currentItem\.parentElement as HTMLElement;\s*\}/,
  `let explicitArrayIndex = -1;
        let explicitArrayKey = null;
        let currentItem = originalTarget;
        while(currentItem && currentItem !== blockContainer) {
            if (currentItem.hasAttribute('data-editor-item-index')) {
                explicitArrayIndex = parseInt(currentItem.getAttribute('data-editor-item-index') || '-1', 10);
                explicitArrayKey = currentItem.getAttribute('data-editor-array-key');
                break;
            }
            currentItem = currentItem.parentElement as HTMLElement;
        }`
);

code = code.replace(
  /let bestMatch: \{ arrayKey: string, index: number \} \| null = null;\s*let found = false;\s*for \(const arrKey of arrays\) \{\s*if \(block\[arrKey\] && Array\.isArray\(block\[arrKey\]\)\) \{\s*if \(explicitArrayIndex !== -1 && explicitArrayIndex < block\[arrKey\]\.length\) \{[\s\S]*?bestMatch = \{ arrayKey: arrKey, index: explicitArrayIndex \};\s*found = true;\s*break;\s*\}/,
  `let bestMatch: { arrayKey: string, index: number } | null = null;
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
                bestMatch = { arrayKey: arrKey, index: explicitArrayIndex };
                found = true;
                break;
             }`
);

fs.writeFileSync('src/admin/PageEditor.tsx', code);
