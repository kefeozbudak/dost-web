const fs = require('fs');

let page_editor = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const old_loop = `        let bestMatch: { arrayKey: string, index: number } | null = null;
        let found = false;

        for (const arrKey of arrays) {
          if (block[arrKey] && Array.isArray(block[arrKey])) {
            let stringMatches = [];`;

const new_loop = `        let bestMatch: { arrayKey: string, index: number } | null = null;
        let found = false;

        for (const arrKey of arrays) {
          if (block[arrKey] && Array.isArray(block[arrKey])) {
            if (explicitArrayIndex !== -1 && explicitArrayIndex < block[arrKey].length) {
                // If it's a known array key that we added explicit indexes for, use it.
                // Assuming explicit array indexes are mostly for 'items'.
                bestMatch = { arrayKey: 'items', index: explicitArrayIndex };
                found = true;
                break;
            }
            let stringMatches = [];`;

if (page_editor.includes(old_loop)) {
    page_editor = page_editor.replace(old_loop, new_loop);
    fs.writeFileSync('src/admin/PageEditor.tsx', page_editor);
    console.log("Patched PageEditor 4 successfully");
} else {
    console.log("Could not find old_loop");
}
