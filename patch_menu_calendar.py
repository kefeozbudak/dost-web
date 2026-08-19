import re

with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

target = """              <div className="flex flex-wrap items-center gap-4 whitespace-normal md:whitespace-pre-line">
                <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm whitespace-normal md:whitespace-pre-line">
                  <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-normal md:whitespace-pre-line">
                    <span
                      className="material-symbols-outlined text-slate-500 whitespace-normal md:whitespace-pre-line"
                      translate="no"
                      aria-hidden="true"
                    >
                      chevron_left
                    </span>
                  </button>
                  <span
                    className={`px-2 md:px-6 font-bold text-slate-800 min-w-[140px] ${block.styles?.textAlign ? "" : "text-center"}`}
                  >
                    {block.month || "Ekim 2023"}
                  </span>
                  <button className="p-2 hover:bg-slate-50 rounded-lg transition-colors whitespace-normal md:whitespace-pre-line">
                    <span
                      className="material-symbols-outlined text-slate-500 whitespace-normal md:whitespace-pre-line"
                      translate="no"
                      aria-hidden="true"
                    >
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>"""

if target in code:
    code = code.replace(target, "")
    with open('src/components/PageBlocks.tsx', 'w') as f:
        f.write(code)
    print("Removed duplicate month navigation in menu_calendar")
else:
    print("Could not find target to remove")
