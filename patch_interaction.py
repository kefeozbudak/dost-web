import re

with open('src/admin/PageEditor.tsx', 'r') as f:
    page_editor = f.read()

# Add activeArrayItem state
if 'const [activeArrayItem, setActiveArrayItem] = useState' not in page_editor:
    page_editor = page_editor.replace('const [editorVisible, setEditorVisible] = useState(false);',
        'const [editorVisible, setEditorVisible] = useState(false);\n  const [activeArrayItem, setActiveArrayItem] = useState<{ arrayKey: string, index: number } | null>(null);')

# Replace handleBlockClick
old_handleBlockClick = """  const handleBlockClick = (index: number, e?: React.MouseEvent) => {
    setSelectedBlockIndex(index);
    setEditorVisible(true);
    if (e) {
      let x = e.clientX + 20;
      let y = e.clientY - 50;
      // Keep it within screen bounds
      if (x + 380 > window.innerWidth) x = window.innerWidth - 400;
      if (y + 600 > window.innerHeight) y = window.innerHeight - 620;
      if (x < 20) x = 20;
      if (y < 20) y = 20;
      setEditorPos({ x, y });
    }
  };"""

new_handleBlockClick = """  const handleBlockClick = (index: number, e?: React.MouseEvent) => {
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
        const target = e.target as HTMLElement;
        const textContent = target.textContent?.trim();
        const tagName = target.tagName.toUpperCase();
        let imageSrc = '';
        if (tagName === 'IMG') {
          imageSrc = (target as HTMLImageElement).src;
        } else if (target.style && target.style.backgroundImage) {
           imageSrc = target.style.backgroundImage.replace(/url\\(['"]?(.*?)['"]?\\)/i, '$1');
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
                const itemImg = item.image || item.icon || item.logo || item.url;
                if (itemImg && typeof itemImg === 'string' && imageSrc.includes(itemImg)) {
                  setActiveArrayItem({ arrayKey: arrKey, index: i });
                  found = true; break;
                }
              }

              if (textContent && textContent.length > 2) {
                 const match = Object.values(item).some(val => {
                    if (typeof val === 'string' && val.length > 2) {
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
  };"""

if old_handleBlockClick in page_editor:
    page_editor = page_editor.replace(old_handleBlockClick, new_handleBlockClick)
else:
    print("WARNING: handleBlockClick not found in PageEditor.tsx")

# Pass activeArrayItem to BlockFormEditor
if 'activeArrayItem={activeArrayItem}' not in page_editor:
    page_editor = page_editor.replace(
        '<BlockFormEditor block={pageData.blocks[selectedBlockIndex]} onChange={handleBlockChange} />',
        '<BlockFormEditor block={pageData.blocks[selectedBlockIndex]} onChange={handleBlockChange} activeArrayItem={activeArrayItem} />'
    )

with open('src/admin/PageEditor.tsx', 'w') as f:
    f.write(page_editor)


with open('src/admin/BlockFormEditor.tsx', 'r') as f:
    block_editor = f.read()

if 'activeArrayItem?: { arrayKey: string, index: number } | null' not in block_editor:
    block_editor = block_editor.replace(
        'export const BlockFormEditor = ({ block, onChange }: { block: any; onChange: (b: any) => void }) => {',
        'export const BlockFormEditor = ({ block, onChange, activeArrayItem }: { block: any; onChange: (b: any) => void; activeArrayItem?: { arrayKey: string, index: number } | null }) => { \n' +
        '  const arrayItemRefs = useRef<{[key: string]: HTMLDetailsElement | null}>({});\n' +
        '  useEffect(() => {\n' +
        '    if (activeArrayItem) {\n' +
        '      const key = `${activeArrayItem.arrayKey}-${activeArrayItem.index}`;\n' +
        '      const el = arrayItemRefs.current[key];\n' +
        '      if (el) {\n' +
        '        el.open = true;\n' +
        '        el.scrollIntoView({ behavior: "smooth", block: "center" });\n' +
        '      }\n' +
        '    }\n' +
        '  }, [activeArrayItem]);\n'
    )

    block_editor = block_editor.replace('import React, { useState } from', 'import React, { useState, useRef, useEffect } from')

# Modify renderArrayEditor to use details summary
old_array_div = """      {(block[arrayKey] || []).map((item: any, idx: number) => (
        <div 
          key={idx} 
          draggable
          onDragStart={(e) => handleDragStart(e, idx)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, idx)}
          className="flex gap-2 items-start bg-slate-50 p-3 rounded-lg border border-slate-200 mb-2 relative cursor-move"
        >
          <GripVertical className="w-4 h-4 text-slate-300 mt-2 shrink-0 cursor-move" />
          <div className="flex-1 space-y-2">"""

new_array_div = """      {(block[arrayKey] || []).map((item: any, idx: number) => (
        <details 
          key={idx} 
          ref={(el) => { arrayItemRefs.current[`${arrayKey}-${idx}`] = el; }}
          className="group/item bg-slate-50 rounded-lg border border-slate-200 mb-2"
        >
          <summary className="flex gap-2 items-center p-3 cursor-pointer list-none select-none">
            <span className="material-symbols-outlined text-[16px] text-slate-400 group-open/item:rotate-90 transition-transform">chevron_right</span>
            <div className="flex-1 font-bold text-xs text-slate-600 truncate">{typeof item === 'string' ? item : (item.title || item.label || item.day || item.name || `Öğe ${idx + 1}`)}</div>
            <GripVertical className="w-4 h-4 text-slate-300 cursor-move" draggable onDragStart={(e) => handleDragStart(e, idx)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, idx)} onClick={(e) => e.preventDefault()} />
          </summary>
          <div className="p-3 pt-0 border-t border-slate-200 flex gap-2 items-start mt-2">
            <div className="flex-1 space-y-2">"""

if old_array_div in block_editor:
    block_editor = block_editor.replace(old_array_div, new_array_div)
    # The closing tags need to be updated:
    # </div>
    # <button onClick=...
    # </div>
    # ))}
    old_array_close = """          <button onClick={() => {
            const newItems = [...(block[arrayKey] || [])];
            newItems.splice(idx, 1);
            handleChange(arrayKey, newItems);
          }} className="text-red-500 hover:text-red-700 p-1">Sil</button>
        </div>
      ))}"""
    new_array_close = """          <button onClick={() => {
            const newItems = [...(block[arrayKey] || [])];
            newItems.splice(idx, 1);
            handleChange(arrayKey, newItems);
          }} className="text-red-500 hover:text-red-700 p-1 text-xs font-bold mt-2">Sil</button>
          </div>
        </details>
      ))}"""
    block_editor = block_editor.replace(old_array_close, new_array_close)

with open('src/admin/BlockFormEditor.tsx', 'w') as f:
    f.write(block_editor)

print("Patch complete")
