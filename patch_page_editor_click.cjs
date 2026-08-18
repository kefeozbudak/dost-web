const fs = require('fs');
let code = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const explicitArrayKeyFind = `// Look for data-editor-item-index in ancestors
        let currentItem = originalTarget;
        while(currentItem && currentItem !== blockContainer) {
            if (currentItem.hasAttribute('data-editor-item-index')) {
                explicitArrayIndex = parseInt(currentItem.getAttribute('data-editor-item-index') || '-1', 10);
                break;
            }
            currentItem = currentItem.parentElement as HTMLElement;
        }`;

const explicitArrayKeyReplace = `// Look for data-editor-item-index in ancestors
        let currentItem = originalTarget;
        let explicitArrayKey = null;
        while(currentItem && currentItem !== blockContainer) {
            if (currentItem.hasAttribute('data-editor-item-index')) {
                explicitArrayIndex = parseInt(currentItem.getAttribute('data-editor-item-index') || '-1', 10);
                explicitArrayKey = currentItem.getAttribute('data-editor-array-key');
                break;
            }
            currentItem = currentItem.parentElement as HTMLElement;
        }`;

code = code.replace(explicitArrayKeyFind, explicitArrayKeyReplace);

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
                    // If it's a known array key that we added explicit indexes for, use it.
                    // Assuming explicit array indexes are mostly for 'items'.
                    bestMatch = { arrayKey: arrKey, index: explicitArrayIndex };
                    found = true;
                    break;
                }
            }
        }`;

code = code.replace(bestMatchFind, bestMatchReplace);

fs.writeFileSync('src/admin/PageEditor.tsx', code);
