import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

arrows_html = """
                <div className="max-w-2xl">
                  <h2 className="font-bold text-[36px] text-[#1a1b23] mb-4">{block.title}</h2>
                  {block.subtitle && <p className="text-[18px] text-[#434654]">{block.subtitle}</p>}
                </div>
                <div className="flex gap-2">
                  <button className="p-3 rounded-full border border-[#e2e8f0] hover:bg-[#faf8ff] transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="p-3 rounded-full border border-[#e2e8f0] bg-[#1d4eca] text-white hover:opacity-90 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
"""

code = code.replace("""
                <div className="max-w-2xl">
                  <h2 className="font-bold text-[36px] text-[#1a1b23] mb-4">{block.title}</h2>
                  {block.subtitle && <p className="text-[18px] text-[#434654]">{block.subtitle}</p>}
                </div>
""", arrows_html)

with open('src/components/PageBlocks.tsx', 'w') as f:
    f.write(code)

