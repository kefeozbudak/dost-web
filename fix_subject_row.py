import re

with open("src/components/LgsCalculator.tsx", "r") as f:
    c = f.read()

# Fix the Net span to look like the inputs
old_net = """        <span
          className={`font-label-md text-label-md bg-opacity-5 px-3 py-1 rounded-md min-w-[3rem] text-center inline-block border ${isPrimary ? "text-primary bg-primary border-primary/20" : "text-secondary bg-secondary border-secondary/20"}`}
        >
          {data.net.toFixed(2)}
        </span>"""
        
new_net = """        <input
          type="text"
          disabled
          value={data.net.toFixed(2)}
          className={`w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center text-slate-500 outline-none font-body-md print:border-0 print:border-b print:border-black print:rounded-none print:px-0 print:py-1`}
        />"""

c = c.replace(old_net, new_net)

with open("src/components/LgsCalculator.tsx", "w") as f:
    f.write(c)

