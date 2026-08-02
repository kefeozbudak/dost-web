with open("src/admin/PageEditor.tsx", "r") as f:
    content = f.read()

import re

# Add state and ref for drag
state_match = r"(const \[pagesList, setPagesList\] = useState<any\[\]>\(\[\]\);)"
state_replace = r"""\1
  const [editorPos, setEditorPos] = useState({ x: window.innerWidth - 420 > 0 ? window.innerWidth - 420 : 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest('button, input, textarea, select, option')) return;
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      posX: editorPos.x,
      posY: editorPos.y
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setEditorPos({
      x: dragStart.current.posX + dx,
      y: dragStart.current.posY + dy
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };"""

content = re.sub(state_match, state_replace, content)

# Remove Draggable wrapper
draggable_start = r"""          // @ts-ignore
          <Draggable
            nodeRef={nodeRef}
            handle="\.drag-handle"
            cancel="button, input, textarea, select, option"
            defaultPosition={{ x: window\.innerWidth - 420 > 0 \? window\.innerWidth - 420 : 20, y: 20 }}
          >"""

content = re.sub(draggable_start, "", content)

draggable_end = r"""          </Draggable>"""
content = re.sub(draggable_end, "", content)

# Update the div with style and drag handle
div_start = r"""            <div 
              ref={nodeRef}
              className="fixed z-50 flex flex-col bg-white shadow-\[0_10px_40px_-10px_rgba\(0,0,0,0\.3\)\] border border-slate-200 rounded-xl overflow-hidden transition-shadow focus-within:shadow-\[0_10px_50px_-10px_rgba\(0,0,0,0\.4\)\]"
              style={{ top: 0, left: 0, width: '380px', height: '600px', resize: 'both', minWidth: '300px', minHeight: '300px' }}
            >
              <div className="drag-handle p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center cursor-move select-none shrink-0">"""

div_replace = r"""            <div 
              ref={nodeRef}
              className="fixed z-50 flex flex-col bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-200 rounded-xl overflow-hidden transition-shadow focus-within:shadow-[0_10px_50px_-10px_rgba(0,0,0,0.4)]"
              style={{ top: `${editorPos.y}px`, left: `${editorPos.x}px`, width: '380px', height: '600px', resize: 'both', minWidth: '300px', minHeight: '300px' }}
            >
              <div 
                className="p-3 border-b border-slate-200 bg-slate-50 flex justify-between items-center cursor-move select-none shrink-0"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
              >"""

content = re.sub(div_start, div_replace, content)

with open("src/admin/PageEditor.tsx", "w") as f:
    f.write(content)
