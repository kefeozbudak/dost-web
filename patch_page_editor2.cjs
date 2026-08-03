const fs = require('fs');

let page_editor = fs.readFileSync('src/admin/PageEditor.tsx', 'utf8');

const old_handleBlockClick = `  const handleBlockClick = (index: number, e?: React.MouseEvent) => {
    setSelectedBlockIndex(index);
    setEditorVisible(true);
    setActiveArrayItem(null);

    if (e) {
      let x = e.clientX + 20;
      let y = e.clientY - 50;
      // Keep it within screen bounds
      if (x + 380 > window.innerWidth) x = window.innerWidth - 400;
      if (y + 600 > window.innerHeight) y = window.innerHeight - 620;
      if (x < 20) x = 20;
      if (y < 20) y = 20;
      setEditorPos({ x, y });

      const block = pageData?.blocks?.[index];
      if (block && e.target) {
        let currentTarget: HTMLElement | null = e.target as HTMLElement;
        let textContent = '';
        let imageSrc = '';
        
        let depth = 0;
        while (currentTarget && depth < 5) {
            if (currentTarget.textContent) {
                const txt = currentTarget.textContent.trim();
                if (txt && !textContent) textContent = txt;
            }
            if (currentTarget.tagName === 'IMG' && !imageSrc) {
                imageSrc = (currentTarget as HTMLImageElement).src;
            } else if (currentTarget.style && currentTarget.style.backgroundImage && !imageSrc) {
                imageSrc = currentTarget.style.backgroundImage.replace(/url\\(['"]?(.*?)['"]?\\)/i, '$1');
            }
            currentTarget = currentTarget.parentElement;
            depth++;
        }

        const arrays = ['items', 'days', 'buttons', 'categories', 'legends', 'sidebarItems'];
        let found = false;

        for (const arrKey of arrays) {
          if (block[arrKey] && Array.isArray(block[arrKey])) {
            for (let i = 0; i < block[arrKey].length; i++) {
              const item = block[arrKey][i];
              if (!item) continue;
              
              if (typeof item === 'string') {
                if (textContent && textContent.includes(item)) {
                  setActiveArrayItem({ arrayKey: arrKey, index: i });
                  found = true; break;
                }
                continue;
              }

              if (imageSrc) {
                const itemImg = item.image || item.icon || item.logo || item.url || item.thumbnail;
                if (itemImg && typeof itemImg === 'string' && imageSrc.includes(itemImg)) {
                  setActiveArrayItem({ arrayKey: arrKey, index: i });
                  found = true; break;
                }
              }

              if (textContent && textContent.length > 0) {
                 const match = Object.values(item).some(val => {
                    if (typeof val === 'string' && val.length > 1) {
                        return textContent.includes(val) || val.includes(textContent);
                    }
                    return false;
                 });
                 if (match) {
                    setActiveArrayItem({ arrayKey: arrKey, index: i });
                    found = true; break;
                 }
              }
            }
          }
          if (found) break;
        }
      }
    }
  };`;

const new_handleBlockClick = `  const handleBlockClick = (index: number, e?: React.MouseEvent) => {
    setSelectedBlockIndex(index);
    setEditorVisible(true);
    setActiveArrayItem(null);

    if (e) {
      let x = e.clientX + 20;
      let y = e.clientY - 50;
      // Keep it within screen bounds
      if (x + 380 > window.innerWidth) x = window.innerWidth - 400;
      if (y + 600 > window.innerHeight) y = window.innerHeight - 620;
      if (x < 20) x = 20;
      if (y < 20) y = 20;
      setEditorPos({ x, y });

      const block = pageData?.blocks?.[index];
      if (block && e.target) {
        let currentTarget: HTMLElement | null = e.target as HTMLElement;
        let textContent = '';
        let imageSrc = '';
        let originalTarget = e.target as HTMLElement;
        
        let depth = 0;
        while (currentTarget && depth < 5) {
            if (currentTarget.textContent) {
                const txt = currentTarget.textContent.trim();
                if (txt && !textContent) textContent = txt;
            }
            if (currentTarget.tagName === 'IMG' && !imageSrc) {
                imageSrc = (currentTarget as HTMLImageElement).src;
            } else if (currentTarget.style && currentTarget.style.backgroundImage && !imageSrc) {
                imageSrc = currentTarget.style.backgroundImage.replace(/url\\(['"]?(.*?)['"]?\\)/i, '$1');
            }
            currentTarget = currentTarget.parentElement;
            depth++;
        }

        const arrays = ['items', 'days', 'buttons', 'categories', 'legends', 'sidebarItems'];
        
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
        }

        let bestMatch: { arrayKey: string, index: number } | null = null;
        let found = false;

        for (const arrKey of arrays) {
          if (block[arrKey] && Array.isArray(block[arrKey])) {
            let stringMatches = [];
            
            for (let i = 0; i < block[arrKey].length; i++) {
              const item = block[arrKey][i];
              if (!item) continue;
              
              if (typeof item === 'string') {
                if (textContent && textContent.includes(item)) {
                  stringMatches.push({ arrayKey: arrKey, index: i });
                }
                continue;
              }

              if (imageSrc) {
                const itemImg = item.image || item.icon || item.logo || item.url || item.thumbnail;
                if (itemImg && typeof itemImg === 'string' && imageSrc.includes(itemImg)) {
                  bestMatch = { arrayKey: arrKey, index: i };
                  found = true; break;
                }
              }

              if (textContent && textContent.length > 0) {
                 const match = Object.values(item).some(val => {
                    if (typeof val === 'string' && val.length > 1) {
                        return textContent.includes(val) || val.includes(textContent);
                    }
                    return false;
                 });
                 if (match) {
                    stringMatches.push({ arrayKey: arrKey, index: i });
                 }
              }
            }
            
            if (found) break;
            
            if (stringMatches.length > 0) {
                if (matchingDOMIndex !== -1 && matchingDOMIndex < stringMatches.length) {
                    bestMatch = stringMatches[matchingDOMIndex];
                } else {
                    bestMatch = stringMatches[0];
                }
                break;
            }
          }
        }
        
        if (bestMatch) {
            setActiveArrayItem(bestMatch);
        }
      }
    }
  };`;

if (page_editor.includes(old_handleBlockClick)) {
    page_editor = page_editor.replace(old_handleBlockClick, new_handleBlockClick);
    fs.writeFileSync('src/admin/PageEditor.tsx', page_editor);
    console.log("Patched PageEditor successfully");
} else {
    console.log("old_handleBlockClick not found in PageEditor.tsx");
}
