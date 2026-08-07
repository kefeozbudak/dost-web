import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

old_empty = """        <span className="text-on-surface-variant font-medium">
          {data.empty}
        </span>"""
        
new_empty = """        <input
          type="text"
          disabled
          value={data.empty}
          className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center text-slate-500 outline-none font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1`}
        />"""

c = c.replace(old_empty, new_empty)

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

