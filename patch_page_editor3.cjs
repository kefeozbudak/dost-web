const fs = require('fs');

let page_editor = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const old_handleBlockClick = `        const arrays = ['items', 'days', 'buttons', 'categories', 'legends', 'sidebarItems'];
        
        // Strategy: gather all possible matches, then pick the one whose DOM position makes sense.
        // Or simply: check the order of matching elements in the DOM.
        
        let blockContainer = originalTarget.closest('.group\\\\/block');
        if (!blockContainer) blockContainer = originalTarget.closest('section');
        
        let matchingDOMIndex = -1;
        if (blockContainer && textContent) {
            // Find all text nodes or elements containing this exact textContent
            const walker = document.createTreeWalker(blockContainer, NodeFilter.SHOW_ELEMENT, null);
            let matchCount = 0;
            let currentNode = walker.nextNode();
            while(currentNode) {
                const el = currentNode as HTMLElement;
                if (el.children.length === 0 && el.textContent?.trim() === textContent) {
                    if (el === originalTarget || el.contains(originalTarget) || originalTarget.contains(el)) {
                        matchingDOMIndex = matchCount;
                        break;
                    }
                    matchCount++;
                }
                currentNode = walker.nextNode();
            }
        }`;

const new_handleBlockClick = `        const arrays = ['items', 'days', 'buttons', 'categories', 'legends', 'sidebarItems'];
        
        let blockContainer = originalTarget.closest('.group\\\\/block') || originalTarget.closest('section');
        let matchingDOMIndex = -1;
        let explicitArrayIndex = -1;
        
        // Look for data-editor-item-index in ancestors
        let currentItem = originalTarget;
        while(currentItem && currentItem !== blockContainer) {
            if (currentItem.hasAttribute('data-editor-item-index')) {
                explicitArrayIndex = parseInt(currentItem.getAttribute('data-editor-item-index') || '-1', 10);
                break;
            }
            currentItem = currentItem.parentElement as HTMLElement;
        }

        if (explicitArrayIndex === -1 && blockContainer && textContent) {
            const walker = document.createTreeWalker(blockContainer, NodeFilter.SHOW_ELEMENT, null);
            let matchCount = 0;
            let currentNode = walker.nextNode();
            while(currentNode) {
                const el = currentNode as HTMLElement;
                if (el.children.length === 0 && el.textContent?.trim() === textContent) {
                    if (el === originalTarget || el.contains(originalTarget) || originalTarget.contains(el)) {
                        matchingDOMIndex = matchCount;
                        break;
                    }
                    matchCount++;
                }
                currentNode = walker.nextNode();
            }
        }`;

if (page_editor.includes(old_handleBlockClick)) {
    page_editor = page_editor.replace(old_handleBlockClick, new_handleBlockClick);
} else {
    console.log("Could not find old_handleBlockClick part 1");
}

const old_handleBlockClick2 = `            if (stringMatches.length > 0) {
                if (matchingDOMIndex !== -1 && matchingDOMIndex < stringMatches.length) {
                    bestMatch = stringMatches[matchingDOMIndex];
                } else {
                    bestMatch = stringMatches[0];
                }
                break;
            }`;

const new_handleBlockClick2 = `            if (stringMatches.length > 0) {
                if (explicitArrayIndex !== -1 && explicitArrayIndex < stringMatches.length) {
                    bestMatch = { arrayKey: arrKey, index: explicitArrayIndex };
                } else if (matchingDOMIndex !== -1 && matchingDOMIndex < stringMatches.length) {
                    bestMatch = stringMatches[matchingDOMIndex];
                } else {
                    bestMatch = stringMatches[0];
                }
                break;
            }`;

if (page_editor.includes(old_handleBlockClick2)) {
    page_editor = page_editor.replace(old_handleBlockClick2, new_handleBlockClick2);
    fs.writeFileSync('src/admin/PageEditor.tsx', page_editor);
    console.log("Patched PageEditor successfully");
} else {
    console.log("Could not find old_handleBlockClick2");
}

