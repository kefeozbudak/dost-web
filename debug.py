import re
with open('src/components/PageBlocks.tsx', 'r') as f:
    code = f.read()

idx = code.find(') : (<div className="pt-6 whitespace-normal md:whitespace-pre-line">')
print(code[idx:idx+1500])
