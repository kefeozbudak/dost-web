import sys

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

marker = """    return (
      <div 
        key={index}
        className={onBlockClick ? "relative group/block" : ""}
        onClick={(e) => { e.stopPropagation(); onBlockClick && onBlockClick(index, e); }}
      >
        
        {renderContent()}
      </div>
    );"""

replacement = """    if (block.isHidden && !onBlockClick) {
      return null;
    }

    return (
      <div 
        key={index}
        className={`${onBlockClick ? "relative group/block" : ""} ${block.isHidden ? "opacity-50 grayscale" : ""}`}
        onClick={(e) => { e.stopPropagation(); onBlockClick && onBlockClick(index, e); }}
      >
        {block.isHidden && onBlockClick && (
          <div className="absolute top-2 right-2 bg-slate-800/80 text-white text-[10px] font-bold px-2 py-1 rounded z-50 shadow backdrop-blur-sm pointer-events-none">
            GİZLİ BÖLÜM
          </div>
        )}
        {renderContent()}
      </div>
    );"""

if marker in code:
    code = code.replace(marker, replacement)
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Updated PageBlocks.tsx wrapper")
else:
    print("Could not find marker")
